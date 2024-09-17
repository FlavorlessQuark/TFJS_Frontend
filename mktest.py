import json

d = {
    "data": {"x": [], "y":[]},
    "xshape":[1],
    "yshape":[1]
}

for i in range(100):
    d["data"]['x'].append([i])
    d["data"]['y'].append([i * 2])

with open("test-set.json", "w") as f:
    json.dump(d, f)
