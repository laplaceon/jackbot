from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import time
import random

driver = webdriver.Firefox(executable_path="./bot/drivers/geckodriver")
driver.get("file:///home/r/Documents/jackbot/index.html")

time.sleep(1)

playArea = driver.find_element_by_id("myCanvas")

keys = {
    0: Keys.CONTROL,
    1: Keys.SPACE
}

while True:
    time.sleep(0.5)

    # Take screenshot
    playArea.screenshot('ss.png')

    # Classify next move and then proc it on play area
    webdriver.ActionChains(driver).key_down(keys[random.choice([0, 1])]).perform()

driver.close()
