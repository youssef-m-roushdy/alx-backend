#!/usr/bin/env python3
"""
Module to calculate the start and end index for pagination.
"""


def index_range(page, page_size):
    """
    Calculate the start and end indexes for pagination.
    """
    start_idx = (page - 1) * page_size
    end_idx = page * page_size
    return start_idx, end_idx
