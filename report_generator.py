from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import os

class ReportGenerator:
    def generate_pdf(self, job_data: dict, output_path: str):
        """
        Generates a detailed PDF report for the given job data using ReportLab.
        """
        doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
        # Use Helvetica everywhere for readability
        styles = getSampleStyleSheet()
        styles['Normal'].fontName = 'Helvetica'
        styles['Normal'].fontSize = 10
        styles['Title'].fontName = 'Helvetica-Bold'
        styles['Heading2'].fontName = 'Helvetica-Bold'
        styles['Heading3'].fontName = 'Helvetica-Bold'
        styles['Heading4'].fontName = 'Helvetica-Bold'
        
        story = []

        # Title
        story.append(Paragraph("ADA Compliance Audit Report", styles['Title']))
        story.append(Spacer(1, 12))
        
        # Meta info
        meta_style = ParagraphStyle('Meta', parent=styles['Normal'], fontSize=10, textColor=colors.gray, fontName='Helvetica')
        story.append(Paragraph(f"<b>Job ID:</b> {job_data.get('id')}", meta_style))
        story.append(Paragraph(f"<b>Date:</b> {job_data.get('created_at')}", meta_style))
        story.append(Spacer(1, 20))
        
        results = job_data.get('results', [])
        if not results:
            story.append(Paragraph("No results found or audit failed.", styles['Normal']))
        else:
            for res in results:
                url = res.get('url', 'Unknown URL')
                score = res.get('score', 0)
                
                # Page Header
                story.append(Paragraph(f"Page: {url}", styles['Heading2']))
                story.append(Paragraph(f"Compliance Score: {score}%", styles['Heading3']))
                story.append(Spacer(1, 15))
                
                # Check for critical page error (e.g. Timeout/403)
                if res.get('error'):
                    error_msg = res.get('error')
                    story.append(Paragraph(f"<b>CRITICAL ERROR:</b> Could not audit page.", styles['Heading4']))
                    story.append(Paragraph(f"<i>Details:</i> <font color='red'>{error_msg}</font>", styles['Normal']))
                    story.append(Spacer(1, 20))
                    story.append(Paragraph("-" * 80, styles['Normal']))
                    story.append(Spacer(1, 20))
                    continue

                categories = ['perceivable', 'operable', 'understandable', 'robust']
                
                for cat in categories:
                    # Category Header
                    story.append(Paragraph(cat.capitalize(), styles['Heading4']))
                    story.append(Spacer(1, 6))
                    
                    category_checks = res.get(cat, [])
                    if not category_checks:
                         story.append(Paragraph("No checks performed for this category.", styles['Normal']))
                    else:
                        # Create Table Data for this category
                        table_data = [['Status', 'Check Name', 'Details']]
                        
                        for check in category_checks:
                            name = check.get('name', 'Unknown Check')
                            status = check.get('status', 'fail').upper()
                            desc = check.get('description', '')
                            remedy = check.get('remediation', '')
                            
                            # Status Color
                            status_color = colors.green if status == 'PASS' else colors.red if status == 'FAIL' else colors.orange
                            status_text = Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", styles['Normal'])
                            
                            import html
                            
                            # Sanitize content for XML (ReportLab Paragraph)
                            # We requested <b> and <br/> from AI, but if we just escape everything we lose them.
                            # Strategy: Escape everything, then restore the specific tags we want.
                            # OR better: The AI output might contain & or < that are NOT tags.
                            # Given the prompt was strict, we hope for the best, but safe approach is to escape 
                            # the raw strings from the dict if they are not the AI parts, but AI parts have HTML.
                            
                            # Let's assume description might have <b> and <br/>.
                            # We can't easily distinguish. 
                            # Error likely comes from standard text like 'x < y' or '&'.
                            # Let's try to just replace & with &amp; if it's not part of an entity?
                            # ReportLab is strict.
                            
                            # Simple fix: Escape known issues.
                            # But wait, if we escape < it breaks <br/>.
                            # Let's just wrap the content in a cleaner function if complex.
                            # For now, let's assume the AI follows instructions but random text from crawling (url, title) might break it?
                            # name, desc, remedy.
                            
                            # Actually, description depends on AI.
                            # Let's escape name and remedy (if static).
                            # For desc, we might need a custom cleaner to escape < > except where part of <br/> <b> </b>.
                            
                            def clean_xml(text):
                                if not text: return ""
                                # Basic escape
                                text = text.replace('&', '&amp;')
                                text = text.replace('<', '&lt;')
                                text = text.replace('>', '&gt;')
                                # Restore allowed tags
                                text = text.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
                                text = text.replace('&lt;br/&gt;', '<br/>').replace('&lt;br&gt;', '<br/>')
                                text = text.replace('&amp;bull;', '•')
                                return text

                            safe_name = clean_xml(name)
                            safe_desc = clean_xml(desc)
                            safe_remedy = clean_xml(remedy)
                            
                            # Status Color
                            status_color = colors.green if status == 'PASS' else colors.red if status == 'FAIL' else colors.orange
                            status_text = Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", styles['Normal'])
                            
                            # Name
                            name_text = Paragraph(f"<b>{safe_name}</b>", styles['Normal'])
                            
                            # Details (Finding + Remediation)
                            details_html = f"<b>Finding:</b> {safe_desc}<br/>"
                            if status != 'PASS' and safe_remedy:
                                details_html += f"<br/><b>Remediation:</b> <font color='#00008B'>{safe_remedy}</font>"
                            
                            details_text = Paragraph(details_html, styles['Normal'])
                            
                            table_data.append([status_text, name_text, details_text])
                        
                        # Create Table
                        # Widths: Status (15%), Name (25%), Details (60%)
                        t = Table(table_data, colWidths=[60, 120, 340], repeatRows=1)
                        t.setStyle(TableStyle([
                            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
                            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                            ('FONTSIZE', (0, 0), (-1, 0), 10),
                            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                            ('LEFTPADDING', (0, 0), (-1, -1), 6),
                            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                            ('TOPPADDING', (0, 0), (-1, -1), 6),
                            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ]))
                        story.append(t)
                    
                    story.append(Spacer(1, 15))
                
                story.append(Spacer(1, 20))
                story.append(Paragraph("-" * 80, styles['Normal']))
                story.append(Spacer(1, 20))
        
        doc.build(story)
        return output_path
