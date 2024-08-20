#!/usr/bin/python3
""" LIFOCache module
"""
BasicCache = __import__('0-basic_cache').BasicCache


class LIFOCache(BasicCache):
    """ LIFOCache defines:
      - constants of your caching system
      - where your data are stored (in a dictionary)
    """
    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        self.cache_data[key] = item

        if len(self.cache_data) > self.MAX_ITEMS:
            keys = list(self.cache_data.keys())
            removed_key = keys[-2]
            self.cache_data.pop(removed_key)
            print("DISCARD: {}".format(removed_key))
