#!/usr/bin/python
import sys
import json
import re
import gzip
import csv
import threading
from pprint import pprint

folder = './domain-sites'
jsonfile = 'scoring_settings.json'
archivegz = 'final.txt.gz'



    #ouverture du fichier json
    #

with open(jsonfile) as data_file:
    data = json.load(data_file)

    nbjsonobj = len(data["contributions"])-1



    listregex =[]
    listecategorie =[]
    #recuperation des patterne
    #+listtask[stop]

    for i in range(0,len(data["contributions"])-1 ):
        if data["contributions"][i]["method"] == 'patternMatching':
                #pprint(data["contributions"][i]["pattern"])
                listregex.append(str(data["contributions"][i]["pattern"]))
                listecategorie.append(str(data["contributions"][i]["category_ID"]))
                i = i+1
    nbregex = len(listregex)




def worker(start,stop):
    #decompression de l'archive gz
    #et lecture du fihier
    if start != 0:     start = nbjsonobj//start
    stop = nbjsonobj//stop
    listtask = [0,nbjsonobj//4,nbjsonobj//2,nbjsonobj//1.25,nbjsonobj]
    fichier = open("result.csv", "w")
    with gzip.open(archivegz, 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter='|')
        pprint(spamreader)
        for row in spamreader:
            #pprint (row)
            site = row[0]
            domain = row[1]
            if len(row) != 3: print row
            else:
                visit = row[2]
    #test des regex
    #
            for c in range(int(start),int(stop)):
                regex=listregex[c]
                categorie=listecategorie[c]
                matchObj = re.match( regex, site)
                if matchObj:
                    pprint (matchObj.group(0))
                    print "Match!!",regex
                    fichier.write(categorie+";"+regex+";"+site+";"+domain+"\n")





    fichier.close()
    """
    commentaire
    """


def func(num):
    """thread worker function"""
    print 'Worker: %s' % num
    return

threads = []
for i in range(2):
    stop = i+1
    t = threading.Thread(target=worker, args=(i,stop,))
    threads.append(t)
    t.start()
