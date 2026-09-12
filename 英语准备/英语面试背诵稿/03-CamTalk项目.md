# 项目一：CamTalk

## 项目介绍
> CamTalk is a real-time vision and voice dialogue system. It needed low data use and short delay. I made a simple key-frame method with voice activity detection and pixel differences. If the user was silent or the picture changed little, we did not send repeated frames. Uploads during silent periods fell by about 80 percent.
> 
> I also helped connect seven nodes, including speech-to-text, an LLM, and text-to-speech. We sent text and audio step by step, so users could hear part of an answer early. The full delay was below 0.5 seconds. This project taught me about multimodal input, system delay, and making a demo into a stable product.

CamTalk 是一个实时视觉和语音对话系统。它需要较少的数据用量和较短的延迟。我用语音活动检测和像素差异设计了一个简单的关键帧方法。如果用户安静或画面变化很小，我们就不发送重复帧。安静时的数据上传量下降了约 80%。
我还参与连接了七个节点，包括语音转文字、大语言模型和文字转语音。我们逐步发送文字和音频，所以用户可以提前听到部分回答。整体延迟低于 0.5 秒。这个项目让我了解了多模态输入、系统延迟，以及如何把演示做成稳定的产品。

## 我的具体贡献
> I was the project leader. My main work was the key-frame method. I compared the current frame with a saved frame. If the pixel difference passed a set value, we sent a new frame. I also helped with the streaming flow and module connection. My goal was to reduce data use while keeping useful pictures.

我是项目负责人。我的主要工作是关键帧方法。我比较当前帧和保存的帧。如果像素差异超过设定值，我们就发送新帧。我还参与了流式流程和模块连接。我的目标是在保留有用画面的同时减少数据用量。

## 为什么不用每一帧
> Many nearby frames are almost the same. Sending every frame wastes bandwidth and computing time. Pixel differences are simple and fast, and they run near the camera. The weakness is that one fixed value may miss small changes. Next, I would try an adaptive value or a learned sampler.

许多相邻帧几乎相同。发送每一帧会浪费带宽和计算时间。像素差异方法简单、快速，可以在摄像头附近运行。它的不足是固定值可能漏掉细微变化。下一步我会尝试自适应值或学习式采样器。

## 如何降低延迟
> We used streaming instead of waiting for the whole process. Each node sent partial data to the next node as soon as it was ready. This made the waiting time shorter. The full delay was below 0.5 seconds.

我们使用流式处理，而不是等待整个流程结束。每个节点一准备好部分数据，就立即发送给下一个节点。这样可以缩短等待时间。整体延迟低于 0.5 秒。

## 局限与下一步
> Pixel differences can be affected by camera movement, light, and the chosen value. We also need a better test of answer quality and system stability. Next, I would test more scenes and devices, use adaptive sampling, and check both delay and task accuracy.

像素差异会受到摄像头运动、光线和设定值的影响。我们还需要更好地测试回答质量和系统稳定性。下一步我会测试更多场景和设备，使用自适应采样，同时检查延迟和任务准确率。
