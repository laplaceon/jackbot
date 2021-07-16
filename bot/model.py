import torch
import torch.nn as nn
import torch.nn.functional as F

class JackBot(nn.Module):
    def __init__(self):
        super(JackBot, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=4, kernel_size=4, stride=2)
        self.conv2 = nn.Conv2d(in_channels=4, out_channels=6, kernel_size=4, stride=2)
        self.clf = nn.Linear(in_features=265428, out_features=2)

    def forward(self, inp):
        out = F.relu(self.conv1(inp))
        out = F.relu(self.conv2(out))

        out = torch.flatten(out, 1)
        out = self.clf(out)

        return out

def get_model():
    return JackBot()
