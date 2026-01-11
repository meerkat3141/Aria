from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import os

class ReportGenerator:
    def generate_pdf(self, job_data: dict, output_path: str):
        doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
        styles = getSampleStyleSheet()
        styles['Normal'].fontName = 'Helvetica'
        styles['Normal'].fontSize = 10
        styles['Title'].fontName = 'Helvetica-Bold'
        styles['Heading2'].fontName = 'Helvetica-Bold'
        styles['Heading3'].fontName = 'Helvetica-Bold'
        styles['Heading4'].fontName = 'Helvetica-Bold'
        
        story = []

        story.append(Paragraph("ADA Compliance Audit Report", styles['Title']))
        story.append(Spacer(1, 12))
        
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
                
                story.append(Paragraph(f"Page: {url}", styles['Heading2']))
                story.append(Paragraph(f"Compliance Score: {score}%", styles['Heading3']))
                story.append(Spacer(1, 15))
                
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
                    story.append(Paragraph(cat.capitalize(), styles['Heading4']))
                    story.append(Spacer(1, 6))
                    
                    category_checks = res.get(cat, [])
                    if not category_checks:
                         story.append(Paragraph("No checks performed for this category.", styles['Normal']))
                    else:
                        table_data = [['Status', 'Check Name', 'Details']]
                        
                        for check in category_checks:
                            name = check.get('name', 'Unknown Check')
                            status = check.get('status', 'fail').upper()
                            desc = check.get('description', '')
                            remedy = check.get('remediation', '')
                            
                            status_color = colors.green if status == 'PASS' else colors.red if status == 'FAIL' else colors.orange
                            status_text = Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", styles['Normal'])
                            
                            import html
                            
                            def clean_xml(text):
                                if not text: return ""
                                text = text.replace('&', '&amp;')
                                text = text.replace('<', '&lt;')
                                text = text.replace('>', '&gt;')
                                text = text.replace('&lt;b&gt;', '<b>').replace('&lt;/b&gt;', '</b>')
                                text = text.replace('&lt;br/&gt;', '<br/>').replace('&lt;br&gt;', '<br/>')
                                text = text.replace('&amp;bull;', '•')
                                return text

                            safe_name = clean_xml(name)
                            safe_desc = clean_xml(desc)
                            safe_remedy = clean_xml(remedy)
                            
                            status_color = colors.green if status == 'PASS' else colors.red if status == 'FAIL' else colors.orange
                            status_text = Paragraph(f"<font color='{status_color.hexval()}'><b>{status}</b></font>", styles['Normal'])
                            
                            name_text = Paragraph(f"<b>{safe_name}</b>", styles['Normal'])
                            
                            details_html = f"<b>Finding:</b> {safe_desc}<br/>"
                            if status != 'PASS' and safe_remedy:
                                details_html += f"<br/><b>Remediation:</b> <font color='#00008B'>{safe_remedy}</font>"
                            
                            details_text = Paragraph(details_html, styles['Normal'])
                            
                            table_data.append([status_text, name_text, details_text])
                        
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
