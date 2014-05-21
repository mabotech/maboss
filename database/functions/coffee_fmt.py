



def clean(lines):
    new_lines = []

    for line in lines.split('\n'):
        line = line.replace('\t','    ')
        line = line.rstrip()
        #print line
        new_lines.append(line)
        
    script = '\n'.join(new_lines)


    #with open('mtp_upsert_cs11.coffee', 'w') as fileh:
    #    fileh.write(scripts)
        
    return script
    
def main():
    
    with open('mtp_upsert_cs8.coffee','r') as ori_fh:
        lines = ori_fh.read()
    
    script = clean(lines)
    
    print script
    
if __name__ == '__main__':
    main()
