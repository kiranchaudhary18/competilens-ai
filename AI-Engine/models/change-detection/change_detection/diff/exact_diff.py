"""
Exact textual diff detection
"""
import difflib
from typing import List, Tuple
import json


class ExactDiff:
    """Simple exact text diffing"""
    
    @staticmethod
    def compare_strings(old: str, new: str) -> dict:
        """
        Compare two strings exactly
        
        Returns:
            {
                'identical': bool,
                'old_text': str,
                'new_text': str,
                'diff_type': str,  # identical, added, removed, modified
                'changes': List[Tuple[operation, text]]
            }
        """
        if old == new:
            return {
                'identical': True,
                'diff_type': 'identical',
                'old_text': old,
                'new_text': new,
                'changes': []
            }
        
        # Get diff operations
        diff_ops = list(difflib.ndiff(old.split(), new.split()))
        
        return {
            'identical': False,
            'diff_type': 'modified',
            'old_text': old,
            'new_text': new,
            'changes': diff_ops
        }
    
    @staticmethod
    def compare_json(old_data: dict, new_data: dict) -> List[dict]:
        """
        Deep diff of two JSON objects
        
        Returns list of changes with paths
        """
        changes = []
        
        ExactDiff._deep_diff(old_data, new_data, [], changes)
        
        return changes
    
    @staticmethod
    def _deep_diff(old, new, path: List[str], changes: List[dict]):
        """Recursively find differences in nested structures"""
        
        if type(old) != type(new):
            changes.append({
                'path': '/'.join(path) if path else 'root',
                'operation': 'type_mismatch',
                'old_value': old,
                'new_value': new,
                'old_type': type(old).__name__,
                'new_type': type(new).__name__
            })
            return
        
        if isinstance(old, dict):
            # Check for removed and modified keys
            for key in old:
                new_path = path + [key]
                if key not in new:
                    changes.append({
                        'path': '/'.join(new_path),
                        'operation': 'removed',
                        'old_value': old[key],
                        'new_value': None
                    })
                else:
                    ExactDiff._deep_diff(old[key], new[key], new_path, changes)
            
            # Check for added keys
            for key in new:
                new_path = path + [key]
                if key not in old:
                    changes.append({
                        'path': '/'.join(new_path),
                        'operation': 'added',
                        'old_value': None,
                        'new_value': new[key]
                    })
        
        elif isinstance(old, list):
            if len(old) != len(new):
                changes.append({
                    'path': '/'.join(path),
                    'operation': 'list_length_change',
                    'old_length': len(old),
                    'new_length': len(new),
                    'old_value': old,
                    'new_value': new
                })
            
            # Compare list items
            for i in range(min(len(old), len(new))):
                new_path = path + [f'[{i}]']
                ExactDiff._deep_diff(old[i], new[i], new_path, changes)
        
        elif old != new:
            changes.append({
                'path': '/'.join(path),
                'operation': 'modified',
                'old_value': old,
                'new_value': new
            })
    
    @staticmethod
    def generate_unified_diff(old_text: str, new_text: str, context: int = 3) -> str:
        """Generate unified diff format"""
        old_lines = old_text.split('\n')
        new_lines = new_text.split('\n')
        
        diff = difflib.unified_diff(
            old_lines,
            new_lines,
            lineterm='',
            n=context
        )
        
        return '\n'.join(diff)


class StructuralDiff:
    """Compare structural differences in data"""
    
    @staticmethod
    def compare_lists(old_list: list, new_list: list) -> dict:
        """Compare two lists for additions, removals, and changes"""
        
        added = [item for item in new_list if item not in old_list]
        removed = [item for item in old_list if item not in new_list]
        unchanged = [item for item in old_list if item in new_list]
        
        return {
            'added': added,
            'removed': removed,
            'unchanged': unchanged,
            'added_count': len(added),
            'removed_count': len(removed),
            'unchanged_count': len(unchanged),
            'total_change_ratio': (len(added) + len(removed)) / max(len(old_list), len(new_list), 1)
        }
    
    @staticmethod
    def compare_dicts_structure(old_dict: dict, new_dict: dict) -> dict:
        """Compare dictionary structure"""
        
        old_keys = set(old_dict.keys())
        new_keys = set(new_dict.keys())
        
        added_keys = new_keys - old_keys
        removed_keys = old_keys - new_keys
        common_keys = old_keys & new_keys
        
        return {
            'added_keys': list(added_keys),
            'removed_keys': list(removed_keys),
            'common_keys': list(common_keys),
            'added_count': len(added_keys),
            'removed_count': len(removed_keys),
            'modified_count': len([k for k in common_keys if old_dict[k] != new_dict[k]])
        }
