#!/usr/bin/python
import sys
import re
import time
from datetime import datetime

postname = ' '.join(sys.argv[1:])

filename = re.sub(r'[^a-zA-Z0-9]+', '-', postname)
filename = datetime.now().strftime('%Y-%m-%d-') + filename + '.md'

timestr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
zone_offset = int(time.localtime().tm_gmtoff/36)
timestr += ('+' if zone_offset >=0 else '-') + str(abs(zone_offset)).zfill(4)

with open(filename, 'w') as f:
    f.write('---\n'
            'layout: post\n'
            'title:  "{}"\n'
            'date:   {}\n'
            'categories: ____TODO____\n'
            '---\n'.format(postname, timestr))

