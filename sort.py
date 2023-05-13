
file = open('cards.js', 'r');
contents = file.read();
file.close()

names = []
lines = contents.split('\n')
for line in lines:
    line = line.replace('\\"', '\\\'\'')
    line = line[10:]
    index = line.index('"')
    uuid = line[:index]
    line = line[index+3:]
    index = line.index('"')
    set_code = line[:index]
    line = line[index+3:]
    index = line.index('"')
    name = line[:index]
    length = 50-len(name)
    while(len(name) < 50):
        name = name + 'z'
    if len(set_code) == 3:
        set_code = set_code+'z'
    names.append((name+set_code+uuid).replace('\\\'\'', '\\"'))

tosort = names.copy()
tosort.sort()
print(tosort)
