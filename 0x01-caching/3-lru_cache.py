#!/usr/bin/python3
""" LRUCache module
"""
BasicCache = __import__('0-basic_cache').BasicCache


class LRUCache(BasicCache):
    """ LRUCache defines:
      - constants of your caching system
      - where your data are stored (in a dictionary)
    """
    def __init__(self):
        super().__init__()
        self.lru_keys = []

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return
        if key in self.lru_keys:
            self.lru_keys.remove(key)
            self.lru_keys.append(key)
        else:
            self.lru_keys.append(key)
        self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            removed_key = self.lru_keys[0]
            self.lru_keys.remove(removed_key)
            self.cache_data.pop(removed_key)
            print("DISCARD: {}".format(removed_key))

    def get(self, key):
        """ Get an item by key
        """
        print(self.lru_keys)
        if key is None or key not in self.cache_data.keys():
            return None

        self.lru_keys.remove(key)
        self.lru_keys.append(key)
        return self.cache_data[key]
