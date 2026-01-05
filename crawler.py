import asyncio
from typing import List, Set
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import httpx

class Crawler:
    def __init__(self, start_url: str, max_pages: int = 5):
        self.start_url = start_url.rstrip('/')
        self.max_pages = max_pages
        self.visited: Set[str] = set()
        self.queue: List[str] = [self.start_url]
        self.domain = urlparse(start_url).netloc

    async def crawl(self) -> List[str]:
        """
        Crawls the website to find up to max_pages unique internal links.
        Prioritizes 'Contact', 'About', 'Pricing'.
        """
        found_urls = []
        
        # We need a headless browser or just simple HTTP requests. 
        # Since we use BS4 for static scraping as per requirements, we'll use httpx to fetch HTML.
        
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            while self.queue and len(found_urls) < self.max_pages:
                current_url = self.queue.pop(0)
                
                if current_url in self.visited:
                    continue
                
                self.visited.add(current_url)
                
                # Check if it's internal
                if urlparse(current_url).netloc != self.domain:
                    continue

                found_urls.append(current_url)
                
                # Stop if we have enough
                if len(found_urls) >= self.max_pages:
                    break

                try:
                    response = await client.get(current_url)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, 'html.parser')
                        links = soup.find_all('a', href=True)
                        
                        # Prioritize specific pages
                        priority_links = []
                        other_links = []
                        
                        for link in links:
                            href = link['href']
                            full_url = urljoin(current_url, href)
                            parsed = urlparse(full_url)
                            
                            # Clean up fragment/query
                            clean_url = (parsed.scheme + "://" + parsed.netloc + parsed.path).rstrip('/')
                            
                            if parsed.netloc == self.domain and clean_url not in self.visited:
                                link_text = link.get_text().lower()
                                if any(p in link_text for p in ['contact', 'about', 'pricing']):
                                    priority_links.append(clean_url)
                                else:
                                    other_links.append(clean_url)
                        
                        # Add to queue (BFS)
                        self.queue.extend(priority_links)
                        self.queue.extend(other_links)
                        
                except Exception as e:
                    print(f"Error crawling {current_url}: {e}")
                    
        return found_urls[:self.max_pages]

if __name__ == "__main__":
    # Test
    async def main():
        c = Crawler("https://www.google.com", max_pages=3)
        urls = await c.crawl()
        print(urls)
    
    asyncio.run(main())
