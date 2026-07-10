"""
HTML cleaning and text extraction
"""
import re
from typing import Tuple
from bs4 import BeautifulSoup
from html.parser import HTMLParser


class HTMLCleaner:
    """Clean HTML and extract clean text"""
    
    def __init__(self):
        self.boilerplate_patterns = [
            r'<script[^>]*>.*?</script>',
            r'<style[^>]*>.*?</style>',
            r'<meta[^>]*>',
            r'<link[^>]*>',
            r'<iframe[^>]*>.*?</iframe>',
            r'<noscript[^>]*>.*?</noscript>',
            r'<!--.*?-->',
        ]
    
    def remove_scripts_and_styles(self, html: str) -> str:
        """Remove script and style tags"""
        for pattern in self.boilerplate_patterns:
            html = re.sub(pattern, '', html, flags=re.IGNORECASE | re.DOTALL)
        return html
    
    def extract_text_from_html(self, html: str) -> Tuple[str, dict]:
        """Extract clean text from HTML"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "meta", "link", "noscript"]):
                script.decompose()
            
            # Get text
            text = soup.get_text(separator='\n', strip=True)
            
            # Extract sections
            sections = self._extract_sections(soup)
            
            return text, sections
        except Exception as e:
            # Fallback if parsing fails
            text = re.sub(r'<[^>]+>', '', html)
            return text, {}
    
    def _extract_sections(self, soup) -> dict:
        """Extract main content sections"""
        sections = {}
        
        # Try to find main sections
        section_ids = ['pricing', 'features', 'security', 'integrations', 'team', 'about']
        
        for section_id in section_ids:
            # Try by ID
            section = soup.find(id=re.compile(section_id, re.I))
            if not section:
                # Try by class
                section = soup.find(class_=re.compile(section_id, re.I))
            if not section:
                # Try by heading
                for heading in soup.find_all(['h1', 'h2', 'h3']):
                    if section_id.lower() in heading.get_text().lower():
                        section = heading
                        break
            
            if section:
                sections[section_id] = section.get_text(separator='\n', strip=True)
        
        return sections
    
    def clean(self, html: str) -> Tuple[str, dict]:
        """Main method to clean HTML and extract text"""
        html = self.remove_scripts_and_styles(html)
        text, sections = self.extract_text_from_html(html)
        return text, sections


class TextExtractor:
    """Extract structured data from text"""
    
    @staticmethod
    def extract_prices(text: str) -> list:
        """Extract currency amounts"""
        pattern = r'\$[\d,]+(?:\.\d{2})?|\d+[\d,]*(?:\.\d{2})?\s*(?:USD|dollars?|€|GBP|₹)'
        return re.findall(pattern, text, re.IGNORECASE)
    
    @staticmethod
    def extract_percentages(text: str) -> list:
        """Extract percentages"""
        pattern = r'\d+(?:\.\d+)?\s*%'
        return re.findall(pattern, text)
    
    @staticmethod
    def extract_numbers(text: str) -> list:
        """Extract all numbers"""
        pattern = r'\d+(?:,\d{3})*(?:\.\d+)?'
        return re.findall(pattern, text)
    
    @staticmethod
    def extract_emails(text: str) -> list:
        """Extract email addresses"""
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return re.findall(pattern, text)
    
    @staticmethod
    def extract_urls(text: str) -> list:
        """Extract URLs"""
        pattern = r'https?://(?:www\.)?[\w/.-]+'
        return re.findall(pattern, text)
    
    @staticmethod
    def extract_feature_lists(text: str) -> list:
        """Extract bullet point lists that look like features"""
        lines = text.split('\n')
        features = []
        
        for line in lines:
            line = line.strip()
            # Match lines that start with bullet points, numbers, or dashes
            if re.match(r'^[•\-\*\d+\.]\s+', line) and len(line) > 5:
                # Remove leading bullet/number
                clean_line = re.sub(r'^[•\-\*\d+\.]+\s+', '', line)
                features.append(clean_line)
        
        return features
