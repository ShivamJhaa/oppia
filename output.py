with open("output.txt") as f:
   content = f.readlines()
 
content = [x.strip() for x in content]
 
prefixes = ("core", "extensions")
content = [x for x in content if x.startswith(prefixes)]
 
content = [x.split('(',1)[0] for x in content]
 
content = list(dict.fromkeys(content))
 
content = sorted(content)
print(content)