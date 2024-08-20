#!/usr/bin/python3
""" LFUCache module
"""
BasicCache = __import__('0-basic_cache').BasicCache


class LFUCache(BasicCache):
    """ LFUCache defines:
      - constants of your caching system
      - where your data are stored (in a dictionary)
    """
    def __init__(self):
        super().__init__()
        self.lfu_keys = []

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.lru_keys.remove(key)
        elif len(self.cache_data) >= self.MAX_ITEMS:
            removed_key = self.lru_keys.pop(0)
            del self.cache_data[removed_key]
            print("DISCARD: {}".format(removed_key))

        self.cache_data[key] = item
        self.lru_keys.append(key)

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        self.lru_keys.remove(key)
        self.lru_keys.append(key)

        return self.cache_data[key]
