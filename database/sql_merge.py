

"""
merge sql scripts to one file.
"""


from time import strftime, localtime

import glob

def main():
    """ merge """
    sql_files = glob.glob("functions/*.sql")

    contents = ""
    
    line = "/*============================================*/\n"

    for filename in sql_files:
        
        
        if filename.count("diff.sql")==1:
            print filename
            continue
        
        with open(filename, 'r') as fileh:
            contents = "".join([contents , fileh.read() , ";\n", line])
            
    output = "pg_functions_%s.sql" % (strftime("%Y%m%d%H%M%S", localtime()))

    with open(output, 'w') as fileh:
        fileh.write(contents)
    

if __name__ == "__main__":
    main()