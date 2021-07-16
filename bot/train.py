from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import torch
import torch.nn.functional as F
import torch.optim as optim
import numpy as np

from model import get_model

from PIL import Image

import time
import random

driver = webdriver.Firefox(executable_path="./drivers/geckodriver")
driver.get("file:///home/r/Documents/jackbot/index.html")

time.sleep(1)

play_area = driver.find_element_by_id("myCanvas")
score_elem = driver.find_element_by_id("hiddenScore")

m = get_model()
m.train()
opt = optim.Adam(m.parameters())

keys = {0: Keys.CONTROL, 1: Keys.SPACE}

last_score = 0

while True:
    time.sleep(0.4)

    # Take screenshot
    play_area.screenshot('ss.png')
    pil_img = Image.open('ss.png').convert('RGB')
    inp = torch.tensor(np.array(pil_img)).float().unsqueeze(0).permute(0, 3, 1, 2)

    # Classify next move and then proc it on play area
    pred = m(inp)
    with torch.no_grad():
        out = torch.argmax(pred).item()
        webdriver.ActionChains(driver).key_down(keys[out]).perform()

        # Calculate score
        score = int(score_elem.get_attribute("score"))
        # out = score

        if score <= last_score:
            out = 1 - out

    opt.zero_grad()

    # Training step
    out = torch.tensor([out])

    loss = F.cross_entropy(pred, out)

    loss.backward()
    opt.step()

driver.close()
