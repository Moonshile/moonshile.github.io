#!/usr/bin/python
import re
import time
import os
from datetime import datetime
import argparse

def create(args):
    now = datetime.now()

    timestr = now.strftime('%Y-%m-%d %H:%M:%S')
    zone_offset = int(time.localtime().tm_gmtoff/36)
    timestr += (' +' if zone_offset >=0 else ' -') + str(abs(zone_offset)).zfill(4)

    postname = ' '.join(args.title)
    filename = re.sub(r'[^a-zA-Z0-9]+', '-', postname)
    filename = now.strftime('%Y-%m-%d-') + filename + '.md'

    with open(os.path.join(args.output_dir[0], filename), 'w') as f:
        f.write('---\n'
                'layout: post\n'
                'title:  "{}"\n'
                'date:   {}\n'
                'categories: ____TODO____\n'
                'author: Kaiqiang Duan\n'
                '---\n'.format(postname, timestr))

def publish(args):
    now = datetime.now()
    srcfile = args.draft_file[0]
    dest_dir = args.output_dir[0]

    with open(srcfile, 'r') as f:
        content = f.read()

    timestr = now.strftime('%Y-%m-%d %H:%M:%S')
    zone_offset = int(time.localtime().tm_gmtoff/36)
    timestr += (' +' if zone_offset >=0 else ' -') + str(abs(zone_offset)).zfill(4)

    contents = content.split('---')
    contents[1] = re.sub(r'date\:[\d\+\-\: ]+', 'date:   ' + timestr, contents[1])

    origin_filename = os.path.basename(srcfile)[11:]
    filename = os.path.join(dest_dir, now.strftime('%Y-%m-%d-') + origin_filename)
    print('publish {} to {}'.format(srcfile, filename))
    with open(filename, 'w') as f:
        f.write('---'.join(contents))


parser = argparse.ArgumentParser(description='Handle posts.')
subparsers = parser.add_subparsers(help='sub-command help')

parser_create = subparsers.add_parser('create', help='create a new post')
parser_create.add_argument('-t', dest='title', type=str, nargs='+', help='Post title')
parser_create.add_argument('-o', dest='output_dir', type=str, nargs='+', help='Output directory')
parser_create.set_defaults(func=create)

parser_publish = subparsers.add_parser('publish', help='publish a post from draft')
parser_publish.add_argument('-d', dest='draft_file', type=str, nargs='+', help='Path to the draft file')
parser_publish.add_argument('-o', dest='output_dir', type=str, nargs='+', help='Output directory')
parser_publish.set_defaults(func=publish)

args = parser.parse_args()
args.func(args)


