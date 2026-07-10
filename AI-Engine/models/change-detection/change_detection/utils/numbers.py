"""
Numeric utilities
"""
import math
from typing import Optional, List


class NumericUtil:
    """Numeric utility functions"""
    
    @staticmethod
    def safe_divide(numerator: float, denominator: float, default: float = 0.0) -> float:
        """Safely divide with default for zero denominator"""
        if denominator == 0:
            return default
        return numerator / denominator
    
    @staticmethod
    def clamp(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
        """Clamp value between min and max"""
        return max(min_val, min(value, max_val))
    
    @staticmethod
    def normalize_0_1(value: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
        """Normalize value to 0-1 range"""
        if max_val == min_val:
            return 0.0
        
        normalized = (value - min_val) / (max_val - min_val)
        return NumericUtil.clamp(normalized)
    
    @staticmethod
    def calculate_zscore(value: float, mean: float, std_dev: float) -> float:
        """Calculate Z-score"""
        if std_dev == 0:
            return 0.0
        return (value - mean) / std_dev
    
    @staticmethod
    def is_outlier(value: float, mean: float, std_dev: float, threshold: float = 2.0) -> bool:
        """Check if value is an outlier (Z-score > threshold)"""
        zscore = NumericUtil.calculate_zscore(value, mean, std_dev)
        return abs(zscore) > threshold
    
    @staticmethod
    def calculate_percentile_rank(value: float, values: List[float]) -> float:
        """Calculate percentile rank of value in list"""
        if not values:
            return 0.0
        
        sorted_values = sorted(values)
        if value in sorted_values:
            rank = (sorted_values.index(value) + 1) / len(sorted_values)
            return rank
        else:
            # Find percentile for value between existing values
            below = sum(1 for v in values if v < value)
            return below / len(values)
    
    @staticmethod
    def moving_average(values: List[float], window_size: int = 3) -> List[float]:
        """Calculate moving average"""
        if len(values) < window_size:
            return values
        
        averages = []
        for i in range(len(values) - window_size + 1):
            window = values[i:i + window_size]
            avg = sum(window) / len(window)
            averages.append(avg)
        
        return averages
