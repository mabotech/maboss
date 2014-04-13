
"""
generate password for pgBounder

...\PostgreSQL\pgBouncer\etc\userlist.txt

"""

import hashlib

print('md5'+hashlib.md5('mabouser'+'mabotech').hexdigest())
