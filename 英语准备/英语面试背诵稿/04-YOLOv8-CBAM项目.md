# 项目二：YOLOv8 + CBAM 钢材缺陷检测

## 项目介绍
> This project checked surface defects on hot-rolled steel. We used the public NEU-DET dataset, with 1,800 images and six defect classes. Cracks were often missed. In the basic YOLOv8 model, crack AP at IoU 0.5 was 52.2 percent. By looking at missed images, I found weak texture and unclear edges.
> 
> I added CBAM, a light attention module, to the Neck of YOLOv8. It first gives more weight to useful channels, then to useful image areas. With the same data and settings, overall mAP at IoU 0.5 rose from 77.5 percent to about 80 to 81 percent. Crack AP rose to about 57 to 60 percent. Processing one image took about 3 milliseconds.

这个项目检测热轧带钢表面缺陷。我们使用公开的 NEU-DET 数据集，包含 1,800 张图像和六类缺陷。裂纹经常被漏检。在基础 YOLOv8 模型中，裂纹在 IoU 0.5 时的 AP 是 52.2%。通过查看漏检图像，我发现原因是纹理弱、边缘不清晰。
我把轻量级注意力模块 CBAM 加入 YOLOv8 的 Neck。它先提高有用通道的权重，再关注有用的图像区域。在相同数据和设置下，IoU 0.5 时的整体 mAP 从 77.5% 提高到约 80%～81%。裂纹 AP 提高到约 57%～60%。处理一张图像约需 3 毫秒。

## 什么是 CBAM
> CBAM has two steps. Channel attention asks which channels matter. It uses average pooling and max pooling. Spatial attention then asks which positions matter. For weak-texture cracks, it helps the model focus on small but useful patterns.

CBAM 有两个步骤。通道注意力判断哪些通道重要，它使用平均池化和最大池化。空间注意力再判断哪些位置重要。对于弱纹理裂纹，它能帮助模型关注细小但有用的模式。

## 为什么放在 Neck
> The Neck joins features at different sizes. It is a good place to improve the joined features before the detector makes a result. It is also lighter than adding attention to every backbone block. I have not compared every possible position yet; that is future work.

Neck 融合不同大小的特征。在检测器输出结果前，这里适合改进融合后的特征。与在每个骨干网络模块中加入注意力相比，这种方法也更轻量。我还没有比较所有可能的位置，这是未来的工作。

## 如何保证实验可信
> I used a controlled ablation test. Both versions had the same data split, preprocessing, augmentation, input size, optimizer, learning-rate plan, and training settings. The only planned change was adding CBAM. A stronger test would use several random seeds and report the average and the spread.

我使用了控制变量的消融实验。两个版本使用相同的数据划分、预处理、增强、输入大小、优化器、学习率计划和训练设置。唯一改变的是是否加入 CBAM。更严格的测试还应使用多个随机种子，并报告平均值和波动范围。

## AP、mAP 和 IoU
> AP is the area under the precision–recall curve for one class. mAP is the average AP of all classes. So 52.2 percent is crack AP, while 77.5 percent and 80 to 81 percent are overall mAP. IoU 0.5 means the predicted box must overlap the real box by at least 0.5.

AP 是一个类别的精确率—召回率曲线下面积。mAP 是所有类别 AP 的平均值。因此 52.2% 是裂纹 AP，77.5% 和 80%～81% 是整体 mAP。IoU 0.5 表示预测框和真实框的重叠度至少要达到 0.5。

## 下一步提高召回率
> I would review missed cracks, especially small, blurred, and low-contrast ones. Then I would try hard-example mining, balanced sampling, and special data changes for weak textures. I would also compare SE and ECA attention. Every change should use the same test method.

我会检查漏检的裂纹，特别是小目标、模糊和低对比度裂纹。然后尝试难例挖掘、均衡采样和针对弱纹理的数据增强。我还会比较 SE 和 ECA 注意力模块。每项改动都应使用相同的测试方法。

## 能否用于真实产线
> NEU-DET has fairly controlled images. A real line may have light changes, blur, vibration, small defects, and unbalanced classes. I would collect real validation images, measure the difference, and set the model and threshold for the real cost of missed defects. I would also test the full system, not only one-image model speed.

NEU-DET 的图像条件比较可控。真实产线可能有光照变化、模糊、振动、小缺陷和类别不平衡。我会收集真实验证图像，测量差异，并根据漏检缺陷的实际代价设置模型和阈值。我还会测试完整系统，而不只是单张图像的模型速度。
