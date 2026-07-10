"""Diff module"""
from .exact_diff import ExactDiff, StructuralDiff
from .numeric_diff import NumericDiff, CurrencyDiff, PercentageDiff, VersionDiff

__all__ = [
    'ExactDiff',
    'StructuralDiff',
    'NumericDiff',
    'CurrencyDiff',
    'PercentageDiff',
    'VersionDiff'
]
