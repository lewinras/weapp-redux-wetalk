# weapp-redux-wetalk（微信小程序结合redux开发的项目）
因为公司项目变更，这个项目不再开发，就放github上了

### 开发思路
笔者一开始先照着微信官方提供的开发文档研究，后来着手开发公司公众号网页项目的小程序版，开发的思路是，创建一个根路径，建立两个子目录，一个src,一个out，平时在src目录开发，当开发阶段完成需要调试时，用gulp工具将代码打包到out目录，再用微信的调试工具在out目录调试，最后用真机调试。在打包过程中，用了gulp-scss插件来处理scss到wxss的转化, gulp-babel库来处理es6,es7的代码, gulp-i18n-locale库来处理本地化插值的替换。目前gulp脚本写的有点乱，而且感觉不是很理想。如果你有用webpack打包小程序项目的经验的话，欢迎分享。如果不太喜欢我这种开发方式的话，也可以直接用微信小程序开发工具来开发，这样更加直观，方便一些，不过不要太过依赖开发工具，尤其是它目前还有一堆奇奇怪怪的Bug，一切以真机为准。

目前，考虑到小程序的数据传递是单向的，因此我们引入了redux来对小程序的数据流进行管理。它是一个根据响应式编程思维编写的数据层的管理框架，借助它，我们将小程序的全局变量由store对象树管理，将每一个page视为一个container，将props替换成小程序每个页面的data, 而action映射到了page对象上。一旦action被触发，将会被dispatch到对应的reducer，然后修改store树，更新page上的布局。然后，用中间件来拦截API请求....顺利将原有的小讲react项目复制到了小程序上。当然，你也可以按照官方的方式，将全局数据交给app对象管理，每个页面独有的数据交给各个页面的data对象进行管理。

在开发过程，不可避免地会遇到复杂的、互相引用的数据，我们使用nomalizr库将API请求返回的结果范式化处理，再更新到store树上，这样做的好处是将众多的数据视为一个虚拟数据库来管理，然后通过ID来索引。不仅管理方便，而且减少了数据重复造成的冗余。

对于store树上的数据获取，我们使用reselect库创建方法来对store树上的数据处理成我们需要的结果来使用，同时reselect库还会将重复获取的不变数据进行缓存，提升数据获取速度。

###小程序开发的坑

1、小程序对CSS的的支持还不是特别完善，很多CSS属性在小程序上无效，使用的时候要避免。尽量不要使用CSS3出现的很多新特性，或者用CSS去实现复杂的动画（可以用原生组件绘制代替），当然，CSS的Flex布局是可以使用的，而且是推荐使用。

2、小程序的渲染表现在模拟器上，Android设备，iOS设备上有差异，这些差异不仅是三端引擎的原因，同时也是原生渲染和网页渲染的方式不同所引起的。

3、小程序虽然是用微信的浏览器内核渲染，但它没有浏览器所特有的session, cokkie，也没有html标签、div标签等。一句话就是，它的运行环境浏览器是不可见的。

4、小程序开发环境支持ES6以及ES7的部分语法，但是运行在设备或者模拟器的时候都是ES5的代码，通过微信开发工具自带的Babel转化。如果要使用ES6以上的API，需要另外导入。

5、小程序导入的第三方库如果引用了浏览器的API，需要事先将第三方库的源码里面的浏览器API部分替换成微信自己的API再引入使用。此外，不同于npm包管理项目，小程序的环境中没有exports变量，这一点也需要处理下。

另外，笔者所用的wechat-redux库是charleyw前辈拿react-redux库所改，因为只实现了将state传入page,而未实现props和redux绑定，所以笔者又将该代码修改了一下。

[charleyw前辈的wechat-redux项目链接](https://github.com/charleyw/wechat-weapp-redux)


