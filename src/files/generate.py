import json
import random
import datetime

# 生成单条数据的函数
def generate_data(index):
    return {
        "new_sample_id": index,
        "parent_id": random.randint(1, 1000),
        "create_time": (datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d %H:%M:%S'),
        "prompt": f"Sample prompt {index}",
        "response": f"Sample response {index}",
        "ranking": random.randint(1, 100)
    }

# 生成十万条数据
data = [generate_data(i) for i in range(1, 100001)]

# 将数据转换为 JSON 格式
json_data = json.dumps(data, indent=4)

# 将 JSON 数据保存到文件
with open('large_data.json', 'w') as json_file:
    json_file.write(json_data)

print("JSON 文件已生成")
