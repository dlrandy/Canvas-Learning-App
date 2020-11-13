# Canvas-Learning-App

### canvas 的应用场景

它可以让我们编程的形式在页面上绘制图片，文本，线和曲线。

canvas 的绘画扩展了一些能力：
stroke，fill， opacity, shadowing，gradient，font，text，image 和合成等

具体应用类比如：

1. paint/sketh 应用
2. 快速交互的游戏
3. 数据分析
4. 类 PS 的图片处理(canvas 支持处理图片颜色的 RGBA,imageData 是一堆的 rgba 数据的集合)
5. 类 flash 的广告和 web 内容

**注意**

- canvas 上已经有的 drawing 是不能移动和编辑的；
- canvas 的绘制非常快，因为使用 GPU
- canvas 可以给出一种运动的错觉，通过快速重复绘制事物

### canvas 的跨域相关

canvas 实现了一系列安全相关的特性，如果图片没有显示的被 origin domain 允许，将会阻止跨域的处理
对于跨域的图片，canvas 处理时，不仅要图片的 host 进行显示设置，还要将 img 的 crossOrigin 属性
设置为"anonymous" or "use-credentials"；

### vscode

https://code.visualstudio.com/docs/editor/extension-gallery

```bash
code --list-extensions >> ./test.json
```

https://daily-dev-tips.com/posts/vanilla-javascript-data-attribute-filters/
