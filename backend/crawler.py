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

        self.edges = [] 

    async def crawl(self) -> dict:
        found_urls = []
        
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0, verify=False) as client:
            while self.queue and len(found_urls) < self.max_pages:
                current_url = self.queue.pop(0)
                
                if current_url in self.visited:
                    continue
                
                self.visited.add(current_url)
                
                if urlparse(current_url).netloc != self.domain:
                    continue

                found_urls.append(current_url)
                
                if len(found_urls) >= self.max_pages:
                    break

                try:
                    response = await client.get(current_url)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, 'html.parser')
                        links = soup.find_all('a', href=True)
                        
                        priority_links = []
                        other_links = []
                        
                        for link in links:
                            href = link['href']
                            full_url = urljoin(current_url, href)
                            parsed = urlparse(full_url)
                            
                            clean_url = (parsed.scheme + "://" + parsed.netloc + parsed.path).rstrip('/')
                            
                            if parsed.netloc == self.domain:
                                self.edges.append({"source": current_url, "target": clean_url})
                                
                            if parsed.netloc == self.domain and clean_url not in self.visited:
                                link_text = link.get_text().lower()
                                if any(p in link_text for p in ['contact', 'about', 'pricing']):
                                    priority_links.append(clean_url)
                                else:
                                    other_links.append(clean_url)
                        
                        self.queue.extend(priority_links)
                        self.queue.extend(other_links)
                        
                except Exception as e:
                    print(f"Error crawling {current_url}: {e}")
                    
        return {
            "pages": found_urls[:self.max_pages],
            "edges": self.edges
        }

if __name__ == "__main__":
    async def main():
        c = Crawler("https://www.google.com", max_pages=3)
        urls = await c.crawl()
        print(urls)
    
    asyncio.run(main())
