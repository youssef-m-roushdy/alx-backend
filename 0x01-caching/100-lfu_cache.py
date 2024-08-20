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
        self.lfu_dict = {}

    def put(self, key, item):
        """ Add an item in the cache
        """
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.lfu_dict[key] += 1
        else:
            if len(self.cache_data) >= self.MAX_ITEMS:
                lfu = min(self.lfu_dict.items())
                lfu_keys = [k for k, v in self.lfu_dict.items() if v == lfu]
                if lfu_keys:
                    removed_key = lfu_keys[0]
                    del self.cache_data[removed_key]
                    del self.lfu_dict[removed_key]
                    print("DISCARD: {}".format(removed_key))
            self.lfu_dict[key] = 1

        self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        self.lfu_dict[key] += 1

        return self.cache_data[key]
