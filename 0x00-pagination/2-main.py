#!/usr/bin/env python3
"""
Main file
"""

get_hyper = __import__('2-hypermedia_pagination').get_hyper



print(get_hyper(1, 2))
print("---")
print(get_hyper(2, 2))
print("---")
print(get_hyper(100, 3))
print("---")
print(get_hyper(3000, 100))
