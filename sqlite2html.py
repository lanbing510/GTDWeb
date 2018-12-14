# -*- coding: utf-8 -*-
"""
Created on Thu Dec 13 13:25:52 2018

@author: Administrator
"""
import pandas as pd
import sqlite3
import sys
reload(sys)
sys.setdefaultencoding("utf-8")


HEADER = '''
<html>
    <head>
        <style>
            .df th{text-align:left;}
            .df ol{padding-left:25px;}
        </style>
    </head>
    <body>
'''
FOOTER = '''
    </body>
</html>
'''

conn = sqlite3.connect('db.sqlite3') 
conn.text_factory=str
cu=conn.cursor()
command="select editor0,editor1,editor2,date,weekday,editor8,editor3,editor4,editor5,editor6,editor7 from diary_diary"
cu.execute(command)
diary=cu.fetchall()
conn.close() 


alldata=[]
data=[]
for d in diary:
    alldata.append(list(d))


df=pd.DataFrame(alldata,index=range(len(alldata)),columns=['年计划','月计划','周计划','日期','星期','脚踏实地','昨日成功日记|惊喜|美好|创意','昨日工作|学习|阅读','昨日睡眠|运动|饮食','昨日人脉|感情|关系','其他|感悟|反省'])

pd.set_option('display.max_colwidth',1000)
df=df.groupby(['年计划','月计划','周计划','日期','星期'],sort=False).sum()


with open('diary.html', 'w') as f:
    f.write(HEADER)
    f.write(df.to_html(escape=False,justify="left",classes='df'))
    f.write(FOOTER)