#!/usr/bin/env python3
"""
Module to provide pagination and hypermedia information.
"""
import math
from typing import Dict
Server = __import__('1-simple_pagination').Server
    
server = Server()


def get_hyper(page: int = 1, page_size: int = 10) -> Dict:
    """
    Retrieve a page of data along with pagination metadata.
    """
    data = server.get_page(page, page_size)
    total_data = len(server.dataset())
    total_pages = math.ceil(total_data / page_size)
    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    return {
        'page_size': page_size,
        'page': page,
        'data': data,
        'next_page': next_page,
        'prev_page': prev_page,
        'total_pages': total_pages
    }
