/*
 *
 * 作者：YYC
 * 制作时间：2012 国庆节
 * 联系我：395976266@qq.com
 * 博客：http://www.cnblogs.com/chaogex/
 */

(function () {
    /*扩展String类
    注意！要放到自执行匿名函数中
    */
    String.prototype.contain = function (str) {
        var reg = new RegExp(str);
        if (this.match(reg)) {  //用this指针指代本体
            return true;
        }
        else {
            return false;
        }
    }

    /* 工具函数 */
    var IsOwnEmptyObject = function (obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
    };
    var Inherit = function (child, parent) {
        var F = function () { };
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        //此处为super的话，360下要出错！！！
        //child.super = parent.prototype;
        child.base = parent.prototype;
        return child;
    };
    var _NToM = function (over, _under) {
        if (over && _under < over) {
            throw new Error("参数错误");
            return;
        }
        under = _under + 1;     //此处要加1。因为_NToM函数只会产生over到_under-1的数。
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * under + 1); //没设下限的话，默认为1
            case 2:
                return Math.floor(Math.random() * (under - over) + over);
            default:
                return 0;
        }
    };
    //over到under的任意整数，且是num的倍数
    var _NToMByT = function (num, over, under) {
        var a = 0,
            b = 0,
            c = 0;

        switch (arguments.length) {
            case 2:
                a = Math.floor(under / num);
                b = 0;  //没设下限的话，默认从0开始
                c = _NToM(a, b);
                return c * num;
            case 3:
                a = Math.floor(under / num);
                b = Math.ceil(over / num);
                if (a < b) {
                    throw new Error("不存over到under且是num的倍数的整数");
                    return;
                }
                c = _NToM(b, a);
                return c * num;
            default:
                throw new Error("_NToMByT 形参不能超过3个");
        }
    };

    //容器类，用于保存蛇的属性、地图等
    var Snake = {

        /* 设置地图宽度、高度、单个单元格的高度和宽度 */
        WIDTH: 40,  //地图宽度为40个单元格
        HEIGHT: 40, //地图高度为40个单元格
        TD: 10, //一个单元格高度和宽度为10px
        /* 地图总的宽度和高度（单位为px） */
        TWIDTH: function () {   //在function里面，this才指向Snake；否则如果TWIDTH为属性的话，this指向global
            return this.TD * this.WIDTH
        },
        THEIGHT: function () {
            return this.TD * this.HEIGHT
        },
        //保存上次按键的时间，用于判断两次按键的间隔是否过短
        date: null,
        //地图
        $map: {},
        //承载对象，用于判断是否相撞
        carrier: {},
        //绿色食物
        $food: {},
        //道具产生的函数setTimeout，为数组
        $propFunc: [],
        //道具
        $prop: {},
        seg: {},
        wallseg: [],
        keycode: null,
        animateTimer: 0,
        //Print()
        printTimer: 0,
        //无敌setTimeout
        $invincible: [],
        //移动墙setTimeout
        $movingWall: [],
        score: 0,
        level: 1,
        lives: 3,
        cherriesEaten: 0,
        //用于在长按加速中保存加速前的速度
        speed_temp: 0,
        speed: 0,
        //加速标志
        accelerate: 0,
        //正常速度标志
        normal: 0,
        //无敌标志
        invincible: 0,
        //开始游戏标志
        start: 0,
        //暂停游戏标志
        stop: 0
    };
    //关卡数组，保存关卡设置
    var WallSetting = [
    ,   //第一个元素为空
    [
        { cherries: 5, length: 5, speed: 5, prop: 5, //prop:道具数量上限
            top: 0, left: 0      //蛇初始位置
        },

        { seg: 30, coordinate: "x", top: 200, left: 50 }
    ],
    [
        { cherries: 10, length: 7, speed: 10, prop: 5, top: 0, left: 0 },

        { seg: 30, coordinate: "x", top: 200, left: 50 },

        { seg: 10,
            //是否移动
            move: true,
            //排列方向
            coordinate: "y",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 50, left: 200
        },
        { seg: 10,
            //是否移动
            move: true,
            //排列方向
            coordinate: "x",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 250, left: 200
        }
    ],
    [
        { cherries: 10, length: 9, speed: 15, prop: 5, top: 20, left: 200 },

        { seg: 30, coordinate: "y", top: 50, left: 50 },
        { seg: 30, coordinate: "y", top: 50, left: 200 },
        { seg: 30, coordinate: "y", top: 50, left: 350 },

        { seg: 9,
            //是否移动
            move: true,
            //排列方向
            coordinate: "x",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 200, left: 70
        },
        { seg: 9,
            //是否移动
            move: true,
            //排列方向
            coordinate: "x",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 200, left: 220
        }
    ],
    [
        { cherries: 10, length: 11, speed: 20, prop: 10, top: 200, left: 200 },

        { seg: 6, coordinate: "y", top: 50, left: 150 },
        { seg: 6, coordinate: "y", top: 50, left: 250 },
        { seg: 10, coordinate: "x", top: 100, left: 50 },
        { seg: 10, coordinate: "x", top: 100, left: 260 },
        { seg: 6, coordinate: "y", top: 300, left: 150 },
        { seg: 6, coordinate: "y", top: 300, left: 250 },
        { seg: 10, coordinate: "x", top: 300, left: 50 },
        { seg: 10, coordinate: "x", top: 300, left: 260 },

        { seg: 8,
            //是否移动
            move: true,
            //排列方向
            coordinate: "x",
            //移动方向
            direction: "left",
            length: 1,
            interval: 500,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 70, left: 240
        },
        { seg: 8,
            //是否移动
            move: true,
            //排列方向
            coordinate: "x",
            //移动方向
            direction: "right",
            length: 1,
            interval: 500,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 320, left: 160
        },
        { seg: 14,
            //是否移动
            move: true,
            //排列方向
            coordinate: "y",
            //移动的方向
            direction: "up",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 280, left: 150
        },
        { seg: 14,
            //是否移动
            move: true,
            //排列方向
            coordinate: "y",
            //移动的方向
            direction: "down",
            length: 3,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 120, left: 250
        }
    ],
    [
    	{ cherries: 10, length: 13, speed: 20, prop: 10, top: 0, left: 0 },

        { seg: 9, coordinate: "y", top: 100, left: 100 },
        { seg: 9, coordinate: "y", top: 210, left: 100 },
        { seg: 9, coordinate: "y", top: 100, left: 300 },
        { seg: 9, coordinate: "y", top: 210, left: 300 },
        { seg: 21, coordinate: "x", top: 100, left: 100 },
        { seg: 21, coordinate: "x", top: 300, left: 100 },

        { seg: 12,
            move: true,
            coordinate: "x",
            direction: "right",
            length: 5,
            interval: 500,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 130, left: 120
        },
        { seg: 12,
            move: true,
            coordinate: "x",
            direction: "left",
            length: 5,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 270, left: 280
        },
        { seg: 15,
            move: true,
            coordinate: "y",
            direction: "down",
            length: 4,
            interval: 800,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 110, left: 120
        },
        { seg: 15,
            move: true,
            coordinate: "y",
            direction: "up",
            length: 4,
            interval: 400,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 290, left: 280
        },
        { seg: 5,
            move: true,
            coordinate: "y",
            direction: "down",
            length: 4,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 0, left: 200
        },
        { seg: 5,
            move: true,
            coordinate: "y",
            direction: "up",
            length: 4,
            interval: 1000,     //间隔不能小于100ms。否则如果在游戏时就可能造成蛇可以穿过移动墙！
            top: 390, left: 200
        }
    ]
];
    //创建地图，并执行。
    //放到此处执行的原因是：
    //因为页面设置css进行了居中调整，所以只有在此处执行后，后面的$("#snake_map").offset().left才能获得正确的坐标。
    (function CreateMap() {
        Snake.$map = $("#snake_map").css({ width: Snake.TD * Snake.WIDTH + "px",
            height: Snake.TD * Snake.HEIGHT + "px",
            border: "1px solid gray"
        });
    } ());
    /* 调整绝对定位的偏移量 
            
    如果页面上写成这样，即snake_map外面套个层，则snake_map的offsetTop仍然
    为snake_map到body的距离！

    <div style="line-height:1000px;">&nbsp;
    </div>
    <div style="line-height:1000px;">&nbsp;
    <span></span>
    <div id="snake_map" >
    <%--   正文--%>
    </div>
    </div>
    */

    //这个在360（ie7）下坐标有问题！因此用JQuery的offset()。
    //        Top: document.getElementById("snake_map").offsetTop,
    //        Left: document.getElementById("snake_map").offsetLeft,


    //将Snake的Top和Left属性放在此处赋值，使其能获得正确的坐标。
    //360(ie7)下，Top要加3
    Snake.Top = $("#ie7").length > 0 ? $("#snake_map").offset().top + 3 : $("#snake_map").offset().top;
    Snake.Left = $("#snake_map").offset().left;

    /*********************************************** 应用状态模式 **********************************************************/

    /*

    父类为State类，其中Do为抽象方法。

    2012 10-3

    */

    /* 父类（抽象类） */
    function State() { };
    State.prototype = {
        Do: function () {
            throw new Error("该方法为抽象方法！必须被重写");
        }
    };

    /* 子类 */
    function SlowState() {
        Inherit(this, State);   //继承State类
    }
    SlowState.prototype.Do = function () {
        // 修改分数
        Snake.score -= 10;  //吃到减速刹车，扣10分
        $("#stats-score").html(Snake.score);

        // 速度过小或者处于手动加速时，不能减速度
        if (Snake.speed > 10 && Snake.speed != 100) {
            Snake.speed -= 10;
            $("#stats-speed").html(Snake.speed);
        }
    };

    function AccelerateState() {
        Inherit(this, State);   //继承State类
    }
    AccelerateState.prototype.Do = function () {
        Snake.score += 20;
        $("#stats-score").html(Snake.score);

        if (Snake.speed < 90) {
            Snake.speed += 5;
            $("#stats-speed").html(Snake.speed);
        }
    };

    //无敌状态。
    //无敌时间可刷新。即例如在第0s吃了一个无敌药水后第5s又吃了一个无敌药水，
    //则第0s到第5s无敌，且第5s到第15s无敌。如果后面又吃了无敌药水，以此类推。
    function InvincibleState() {
        Inherit(this, State);   //继承State类
    }
    InvincibleState.prototype.Do = function (func) {
        Snake.score += 50;
        $("#stats-score").html(Snake.score);

        Snake.invincible += 1;  //可以吃多个无敌药水，无敌时间会刷新

        //无敌时间持续10s
        Snake.$invincible.push(window.setTimeout(function () {
            if (Snake.invincible !== 0) {
                if (Snake.invincible - 1 >= 0) {
                    Snake.invincible -= 1;
                }
                else {
                    throw new Error("无敌状态出错！");
                }
            }

            //无敌时间结束，执行func委托
            if (Snake.invincible === 0) {
                func && func("无敌时间结束", 3000);
            }
        }, 10000));
    };

    //生命状态。
    //无敌时间可刷新。即例如在第0s吃了一个无敌药水后第5s又吃了一个无敌药水，
    //则第0s到第5s无敌，且第5s到第15s无敌。如果后面又吃了无敌药水，以此类推。
    function LifeState() {
        Inherit(this, State);   //继承State类
    }
    LifeState.prototype.Do = function (func) {
        Snake.score += 50;
        $("#stats-score").html(Snake.score);

        Snake.lives += 1;
        $("#stats-live").html(Snake.lives);
    };

    function FoodState() {
        Inherit(this, State);   //继承State类
    }
    FoodState.prototype.Do = function (func) {
        Snake.score += 10;
        $("#stats-score").html(Snake.score);

        Snake.cherriesEaten++;
        //刷新显示
        $("#stats-eaten").html(Snake.cherriesEaten);
        $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);

        if (Snake.speed < 90) {
            Snake.speed += 2;
            $("#stats-speed").html(Snake.speed);
        }

        func && func("吃到绿色食物", 2000);

        Snake.seg.length++;
        $("#stats-length").html(Snake.seg.length);
    };

    //调用者
    var State_Context = (function () {
        return {
            SlowState: (function () {
                var state = null;
                //单例模式
                var GetInstance = function () {
                    if (state) {
                        return state;
                    }
                    else {
                        state = new SlowState();
                        return state;
                    }
                };
                return {
                    Do: function (func) {
                        //此处加上逻辑判断
                        GetInstance().Do();
                    }
                }
            } ()),
            AccelerateState: (function () {
                var state = null;
                //单例模式
                var GetInstance = function () {
                    if (state) {
                        return state;
                    }
                    else {
                        state = new AccelerateState();
                        return state;
                    }
                };
                return {
                    Do: function (func) {
                        //此处加上逻辑判断
                        GetInstance().Do();
                    }
                }
            } ()),
            InvincibleState: (function () {
                var state = null;
                //单例模式
                var GetInstance = function () {
                    if (state) {
                        return state;
                    }
                    else {
                        state = new InvincibleState();
                        return state;
                    }
                };
                return {
                    Do: function (func) {
                        //此处加上逻辑判断
                        GetInstance().Do(func);
                    }
                }
            } ()),
            LifeState: (function () {
                var state = null;
                //单例模式
                var GetInstance = function () {
                    if (state) {
                        return state;
                    }
                    else {
                        state = new LifeState();
                        return state;
                    }
                };
                return {
                    Do: function (func) {
                        //此处加上逻辑判断
                        GetInstance().Do(func);
                    }
                }
            } ()),
            FoodState: (function () {
                var state = null;
                //单例模式
                var GetInstance = function () {
                    if (state) {
                        return state;
                    }
                    else {
                        state = new FoodState();
                        return state;
                    }
                };
                return {
                    Do: function (func) {
                        //此处加上逻辑判断
                        GetInstance().Do(func);
                    }
                }
            } ())
        }
    } ());
    /*********************************************** 结束 *************************************************************/

    //游戏主类
    MyGame = (function () {
        //添加坐标及name
        //Snake.carrier使用Object对象来存储
        var AddPosition = function (left, top, name) {
            //            //清空坐标
            //            if (arguments.length == 2 && arguments[1] == "clear"){
            //                Snake.carrier = {};
            //                return;
            //            }

            //如果Snake.carrier[left]为undefine，则直接添加Snake.carrier[left][top] = name;要报错！！！
            if (!Snake.carrier[left]) {
                Snake.carrier[left] = {};
            }
            Snake.carrier[left][top] = name;
        };
        //绑定键盘事件
        var KeyboardEvent = function () {
            document.onkeydown = function (_e) {
                var keycode = (_e == null) ? event.keyCode : _e.which;
                var e = _e ? _e : window.event; //兼容ie和其它浏览器
                var new_date = null, interval = null;
                //将这部分代码移到if外面，使得即使Snake.start不等于1（即游戏未开始），也可以按“N”键进行新游戏
                switch (keycode) {
                    case 78:
                        if (!-[1,]) {     //ie浏览器禁止方向键控制滚动条滚动
                            e.returnValue = false;
                        }
                        else {
                            e.preventDefault();
                        }

                        NewGame(true);
                        break;
                    default:
                        break;
                }
                if (Snake.start == 1) {     //游戏开始后再设置其余的keydown事件
                    if (Snake.date) {   //第一次移动时，不计算间隔；第二次移动时才开始计算。
                        new_date = new Date();
                        interval = new_date.getTime() - Snake.date.getTime();   //与上次按键的间隔
                        //如果一直按到对应的方向键不放，则加速
                        if (interval < 50 && keycode == Snake.keycode) {
                            if (Snake.speed != 100) {
                                Snake.speed_temp = Snake.speed; //保存加速前的速度
                                Snake.speed = 100;
                                Snake.accelerate = 1;   //置加速标志为1
                                $("#stats-speed").html(Snake.speed);
                                Print("加速", 2000);
                            }
                        }
                        //阻止间隔小于制定毫秒的操作
                        if (interval < 3000 / (Snake.speed + 10)) {
                            return false;
                        }
                    }
                    Snake.date = new Date();    //保存本次按键时间，用于计算两次按键时间的间隔
                    //$.browser.msie：判断浏览器为ie浏览器
                    switch (keycode) {
                        case 80:
                            if (!-[1,]) {     //ie浏览器禁止方向键控制滚动条滚动
                                e.returnValue = false;
                            }
                            else {  
                                e.preventDefault();
                            }

                            Pause();
                            break;
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            if (!-[1,]) {     //ie浏览器禁止方向键控制滚动条滚动
                                e.returnValue = false;
                            }
                            else {
                                e.preventDefault();
                            }

                            //禁止反向前进（即往右走时不能往左走，往上走时不能往下走等）
                            if (
            			keycode == 37 && Snake.keycode == 39 ||
            			keycode == 39 && Snake.keycode == 37 ||
            			keycode == 38 && Snake.keycode == 40 ||
            			keycode == 40 && Snake.keycode == 38
            		) {
                                //如果蛇处于加速状态且按了反方向键，则速度恢复正常
                                if (Snake.speed == 100) {
                                    Snake.speed = Snake.speed_temp;

                                    Snake.accelerate = 0;   //置加速标志为0
                                    Snake.normal = 1;   //置正常速度标志位1
                                    $("#stats-speed").html(Snake.speed);
                                    Print("正常速度", 2000);
                                }
                                break;
                            }
                            else {
                                Snake.keycode = keycode;
                            }
                            break;
                        default: break;
                    }
                };
            };
        };
        //移动的逻辑判断
        var Step = function () {
            var name = "";
            var keycode = Snake.keycode;
            var wall = 0;   //穿墙标志

            //如果蛇身全部显示在地图上了，则释放蛇尾坐标。
            //seg[1]是蛇尾。
            if (Snake.seg[1].left != Snake.seg[2].left || Snake.seg[1].top != Snake.seg[2].top) {
                //                //如果蛇尾不在墙里面（无敌状态），则释放蛇尾的坐标
                //                if (!JudgeHit(Snake.seg[1], "wall") && !JudgeHit(Snake.seg[1], "movingWall")) {
                //                    AddPosition(Snake.seg[1].left, Snake.seg[1].top, undefined);
                //                }
                if (JudgeHit(Snake.seg[1], "snake")) {
                    AddPosition(Snake.seg[1].left, Snake.seg[1].top, undefined);
                }
            }

            //蛇身除了seg[0]，其余往前移		
            for (var i = 1; i < Snake.seg.length; i++) {
                Snake.seg[i].top = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].top;
                Snake.seg[i].left = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].left;
            }
            //seg[0]是蛇头
            if (keycode == 39) {    //右
                Snake.seg[0].left += Snake.TD;
                if (Snake.seg[0].left > (Snake.TWIDTH() + Snake.Left - Snake.TD)) {
                    //如果GameOver，则退出该函数
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].left = Snake.Left;
                }
            } else if (keycode == 40) {     //下
                Snake.seg[0].top += Snake.TD;
                if (Snake.seg[0].top > (Snake.THEIGHT() + Snake.Top - Snake.TD)) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].top = Snake.Top;
                }
            } else if (keycode == 38) {     //上
                Snake.seg[0].top -= Snake.TD;
                if (Snake.seg[0].top < Snake.Top) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].top = Snake.Top + Snake.THEIGHT() - Snake.TD;
                }
            } else if (keycode == 37) {     //左
                Snake.seg[0].left -= Snake.TD;
                if (Snake.seg[0].left < Snake.Left) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].left = Snake.Left + Snake.TWIDTH() - Snake.TD;
                }
            }
            //吃到食物
            (JudgeHit(Snake.seg[0], "food")) &&
			Advance();
            //撞到自己
            if ((JudgeHit(Snake.seg[0], "snake")) && GameOver()) {
                return;
            }
            //撞到墙
            if ((JudgeHit(Snake.seg[0], "wall"))) {
                if (!Snake.invincible && GameOver()) {
                    return;
                }
                //无敌
                else if (Snake.invincible) {
                    //置穿墙标志为1，用于判断是否保持墙的坐标
                    wall = 1;
                }
            }
            //吃到减速刹车
            if (JudgeHit(Snake.seg[0], "slow")) {
                Print("获得减速刹车", 2000);
                //隐藏道具
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //该位置坐标为蛇占领
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //进入减速状态
                State_Context.SlowState.Do();

                RefreshAndWalk();
            }
            //吃到加速溜冰鞋
            if (JudgeHit(Snake.seg[0], "accelerate")) {
                Print("获得加速溜冰鞋", 2000);
                //隐藏道具
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //该位置坐标为蛇占领
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //进入减速状态
                State_Context.AccelerateState.Do();

                RefreshAndWalk();
            }
            //吃到毒药敌敌畏
            if (JudgeHit(Snake.seg[0], "posion")) {
                if (!Snake.invincible && GameOver()) {
                    return;
                }
                //隐藏道具
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //该位置坐标为蛇占领
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
            }
            //吃到无敌药水
            if (JudgeHit(Snake.seg[0], "invincible")) {
                Print("获得无敌药水，10s内无敌", 2000);
                //隐藏道具
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //该位置坐标为蛇占领
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //进入无敌状态
                State_Context.InvincibleState.Do(Print);
            }
            //吃到生命之树
            if (JudgeHit(Snake.seg[0], "life")) {
                Print("获得生命之树，生命加1", 2000);
                //隐藏道具
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //该位置坐标为蛇占领
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //进入生命状态
                State_Context.LifeState.Do();
            }
            //进入下一关
            (Snake.cherriesEaten == WallSetting[Snake.level][0].cherries) &&
                        			AdvanceLevel();
            //重定位蛇
            for (var i = 0; i < Snake.seg.length; i++) {
                Snake.seg[i].css({ top: Snake.seg[i].top + "px", left: Snake.seg[i].left + "px" });
            }
            //如果没有处于无敌状态且遇到墙，且没有遇到移动墙，则增加蛇头的坐标
            if (!wall && !JudgeHit(Snake.seg[0], "movingWall")) {
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
            }
            //如果长按加速或按反方向键恢复正常速度，则刷新速度
            if (Snake.accelerate == 1 || Snake.normal == 1) {
                RefreshAndWalk();
            }
        };
        //吃到食物，蛇长度加1
        var Advance = function (val) {
            //进入food状态
            State_Context.FoodState.Do();

            var x = Snake.seg.length - 1;
            //增加的蛇身绑定dom元素
            Snake.seg[x] = $('<span class="snake"></span>')
		.css({ left: Snake.seg[1].left + "px", top: Snake.seg[1].top + "px" })
		.appendTo(Snake.$map);
            //定位新增加的蛇身
            Snake.seg[x].top = Snake.seg[x - 1].top;
            Snake.seg[x].left = Snake.seg[x - 1].left;
            //将增加的蛇身的坐标加入
            AddPosition(Snake.seg[x].left, Snake.seg[x].top, "snake");
            //重新添加食物
            AddObject.Food();
            //刷新
            RefreshAndWalk();

            return false;
        };
        //刷新蛇速度并移动
        var RefreshAndWalk = function () {
            if (Snake.animateTimer) {
                clearInterval(Snake.animateTimer);
            }
            Snake.animateTimer = setInterval(Step, Math.floor(3000 / Snake.speed));
        };
        //过关，进入下一关
        var AdvanceLevel = function () {
            if (Snake.level == WallSetting.length - 1) {
                FinishedGame();
            } else {
                Snake.level++;
                Snake.speed = WallSetting[Snake.level][0].speed;
                //因为NewGame虽然会重置加速、减速标志，但它延迟3秒才调用，期间蛇可能将继续移动，
                //所以需手动重置加速、减速标志为0
                Snake.accelerate = 0;
                Snake.normal = 0;

                Pause();

                Print("进入第" + Snake.level + "关  您有" + Snake.lives + "条生命  " + "您需要吃掉" + WallSetting[Snake.level][0].cherries + "个绿色食物就能过关！", 3000);
                /* 这种写法，会造成NewGame(reset)的形参reset不为undefined，而为一个数字（为什么是数字？）
                window.setTimeout(NewGame, 3000);
                */
                window.setTimeout(function () { NewGame(); }, 3000);
            }
        };
        //判断是否相撞
        var JudgeHit = function (obj_needle, name) {
            if (name) {
                //如果坐标上有该物品，则判断为相撞。
                //这里用contain的原因是道具如减速刹车等，它的名字可能为slow0、slow1等，
                //而此处传进来的name为slow，因此用contain来判断。
                if (Snake.carrier[obj_needle.left] && Snake.carrier[obj_needle.left][obj_needle.top]
                    && Snake.carrier[obj_needle.left][obj_needle.top].contain(name)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (Snake.carrier[obj_needle.left] && Snake.carrier[obj_needle.left][obj_needle.top]) {   //如果坐标上有物品，则判断为相撞
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        //产生指定范围随机点（Snake.TD的倍数）
        var randomPointer = function (startX, startY, endX, endY) {
            var startX = (startX) || 0;
            var startY = (startY) || 0;
            var endX = endX || (parseInt(Snake.TWIDTH()) - Snake.TD);    //要-Snake.TD，否则可能超出边界
            var endY = endY || (parseInt(Snake.THEIGHT()) - Snake.TD);    //要-Snake.TD，否则可能超出边界
            var p = {},
            x = Snake.Left + _NToMByT(Snake.TD, startX, endX),   //在此处加上偏移量！
            y = Snake.Top + _NToMByT(Snake.TD, startY, endY);

            p.left = x;
            p.top = y;

            if (JudgeHit(p)) {
                return randomPointer(startX, startY, endX, endY);    //如果产生的坐标处已有了东西，则递归
            }
            return p;
        };
        //产生随机整数
        var randomNum = function (over, under) {
            return _NToM(over, under);
        };
        //添加物品和障碍
        var AddObject = {
            //判断生成的坐标是否在蛇的附近。
            //如果生成的坐标落在以蛇头的坐标为中心，长宽都为2 * range的正方形范围内，
            //则判断为在附近。
            JudgeAroundSnake: function (position, range) {
                if (Math.abs(position.left - Snake.seg[0].left) < range && Math.abs(position.top - Snake.seg[0].top) < range) {
                    return true;
                }
                else {
                    return false;
                }
            },
            //随机产生坐标并添加
            Add: function (object, name) {
                var position = null;
                //道具或事物的坐标不能在蛇附近
                do {
                    position = randomPointer();
                } while (this.JudgeAroundSnake(position, 5 * Snake.TD));
                object.css({ top: position.top + "px", left: position.left + "px" });
                return position;

            },
            Food: function () {
                var position = null;

                Snake.$food.show();
                position = this.Add(Snake.$food);
                Snake.$food.left = position.left;
                Snake.$food.top = position.top;
                AddPosition(position.left, position.top, "food");
            },
            //生成道具
            Prop: function (_name, time_over, time_under, func, _num_over, _num_under) {
                //生成道具的随机数量
                //默认为1到5个，
                //如果只设置了_num_over而没有设置_num_under，则生成_num_over个。
                var num = _num_over ? (_num_under ? randomNum(_num_over, _num_under) : _num_over) : randomNum(1, 5);
                var prop = {}, prop_position = {}, left = 0, top = 0, position = null, _this = this, object = null;
                var name = "";
                var k = 0;

                for (var i = 0; i < num; i++) {
                    Snake.$propFunc.push(window.setTimeout(function PropTime() {
                        //如果当前状态为暂停，则PropTime本次不执行，
                        //延迟到randomNum(time_over, time_under)时间后再执行。
                        //使用递归实现。
                        if (Snake.stop == 1) {
                            Snake.$propFunc.push(window.setTimeout(function () { PropTime(); }, randomNum(time_over, time_under)));
                            return;
                        }
                        //把加入序号的代码放到setTimeout中！这样才能保证是按顺序加的序号。
                        name = _name + k.toString();
                        object = $('<span class="' + _name + '"></span>').appendTo(Snake.$map); //类名还是用原始的_name
                        position = _this.Add(object);
                        //如果为添加道具，则用$prop来保存道具对象
                        //此处name为加了序号的名字，如slow0、slow1等
                        Snake.$prop[name] = object;
                        Snake.$prop[name].left = position.left;
                        Snake.$prop[name].top = position.top;

                        AddPosition(position.left, position.top, name);
                        //调用委托
                        func && func(Snake.$prop[name]);

                        k++;    //序号加1
                        return;
                    }, randomNum(time_over, time_under)));
                }
            },
            Wall: {
                Generate: function () {
                    var walls = WallSetting[Snake.level], i;
                    //添加墙
                    for (i = 1; i < walls.length; i++) {
                        if (walls[i].move) {    //判断为移动墙还是静止的墙
                            if (walls[i].coordinate == "x") {
                                this.MovingWallByX(walls[i]);
                            }
                            else if (walls[i].coordinate == "y") {
                                this.MovingWallByY(walls[i]);
                            }
                        }
                        else {
                            if (walls[i].coordinate == "x") {
                                this.StaticWallByX(walls[i]);
                            }
                            else if (walls[i].coordinate == "y") {
                                this.StaticWallByY(walls[i]);
                            }
                        }
                    }
                },
                //左右移动的墙
                //蛇头碰到移动的墙，就gameover，而蛇身碰到墙则不受影响
                MovingWallByX: function (wall) {
                    var c = 0, t = 0, l = 0, n = 0,
                    step = 0,   //移动的步数
                    start = 0,  //第一次移动的标志
                    temp = 0, object = [], len = 0,
                    direction = wall.direction ? (wall.direction == "left" ? -1 : 1) : 1,  //默认为向右移动
                    init_direction = direction; //保存墙指定移动的方向

                    len = wall.length;  //墙的宽度
                    t = wall.top;
                    l = wall.left;
                    temp = wall.left;

                    var Right = {
                        AddWall: function () {
                            //object[0]可以看作墙头，墙身以墙头开始向下边开始添加
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + "px", left: Snake.Left + l + k * Snake.TD + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //墙移动的范围内都先加入到坐标对象中（设为"movingWall"），这样可防止道具或事物产生在墙移动的范围中
                            //注意！此处要加上墙的宽度len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + wall.left + n * Snake.TD, Snake.Top + t, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //将墙的坐标设为"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + "px", left: Snake.Left + l + i * Snake.TD + "px" });
                                AddPosition(Snake.Left + l + i * Snake.TD, Snake.Top + t, "wall");
                            }
                        }
                    };
                    var Left = {
                        AddWall: function () {
                            //object[0]可以看作墙头，墙身以墙头开始向上边开始添加
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + "px", left: Snake.Left + l - k * Snake.TD + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //墙移动的范围内都先加入到坐标对象中（设为"movingWall"），这样可防止道具或事物产生在墙移动的范围中
                            //注意！此处要加上墙的宽度len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + wall.left - n * Snake.TD, Snake.Top + t, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //将墙的坐标设为"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + "px", left: Snake.Left + l - i * Snake.TD + "px" });
                                AddPosition(Snake.Left + l - i * Snake.TD, Snake.Top + t, "wall");
                            }
                        }
                    };
                    (init_direction == -1 && Left.AddMovingWallPosition()) || (init_direction == 1 && Right.AddMovingWallPosition());
                    (init_direction == -1 && Left.AddWall()) || (init_direction == 1 && Right.AddWall());
                    if (Snake.start == 1) {     //游戏开始后，移动墙才能开始移动
                        //MovingWall的局部变量对window.setInterval来说相当于全局变量，
                        //且由于是闭包，可以保存对MovingWall的局部变量的修改。
                        //如window.setInterval里面的l和step等可以累加或累减。
                        Snake.$movingWall.push(window.setInterval(function () {
                            //如果暂停了游戏，则墙不移动。
                            if (Snake.stop == 1) {
                                return;
                            }
                            else {
                                (init_direction == -1 && Left.AddMovingWallPosition()) || (init_direction == 1 && Right.AddMovingWallPosition());
                                //如果墙不是第一次移动且如果移动到最大，则反向
                                if (start && (Math.abs(step) == wall.seg || step === 0)) {
                                    direction = (direction == 1 ? -1 : 1);
                                }
                                if (direction == 1) {
                                    l += Snake.TD;
                                    step++;
                                }
                                else {
                                    l -= Snake.TD;
                                    step--;
                                }
                                (init_direction == -1 && Left.AddWallPosition()) || (init_direction == 1 && Right.AddWallPosition());
                                //第一次移动后
                                if (start === 0) {
                                    start = 1;
                                }
                            }
                        }, wall.interval));
                    }
                },
                //上下移动的墙
                //蛇头碰到移动的墙，就gameover，而蛇身碰到墙则不受影响
                MovingWallByY: function (wall) {
                    var c = 0, t = 0, l = 0, n = 0,
                    step = 0,
                    temp = 0, object = [], len = 0,
                    start = 0,  //墙第一次移动的标志
                    direction = wall.direction ? (wall.direction == "up" ? -1 : 1) : 1,
                    init_direction = direction; //保存墙指定移动的方向

                    len = wall.length;  //墙的宽度
                    t = wall.top;
                    l = wall.left;
                    temp = wall.top;

                    var Down = {
                        AddWall: function () {
                            //object[0]可以看作墙头，墙身以墙头开始向下边开始添加
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + k * Snake.TD + "px", left: Snake.Left + l + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //墙移动的范围内都先加入到坐标对象中（设为"movingWall"），这样可防止道具或事物产生在墙移动的范围中
                            //注意！此处要加上墙的宽度len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + l, Snake.Top + wall.top + n * Snake.TD, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //将墙的坐标设为"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + i * Snake.TD + "px", left: Snake.Left + l + "px" });
                                AddPosition(Snake.Left + l, Snake.Top + t + i * Snake.TD, "wall");
                            }
                        }
                    };
                    var Up = {
                        AddWall: function () {
                            //object[0]可以看作墙头，墙身以墙头开始向上边开始添加
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t - k * Snake.TD + "px", left: Snake.Left + l + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //墙移动的范围内都先加入到坐标对象中（设为"movingWall"），这样可防止道具或事物产生在墙移动的范围中
                            //注意！此处要加上墙的宽度len
                            for (n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + l, Snake.Top + wall.top - n * Snake.TD, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //将墙的坐标设为"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t - i * Snake.TD + "px", left: Snake.Left + l + "px" });
                                AddPosition(Snake.Left + l, Snake.Top + t - i * Snake.TD, "wall");
                            }
                        }
                    };
                    (init_direction == -1 && Up.AddMovingWallPosition()) || (init_direction == 1 && Down.AddMovingWallPosition());
                    (init_direction == -1 && Up.AddWall()) || (init_direction == 1 && Down.AddWall());
                    if (Snake.start == 1) {     //游戏开始后，移动墙才能开始移动
                        //MovingWall的局部变量对window.setInterval来说相当于全局变量，
                        //且由于是闭包，可以保存对MovingWall的局部变量的修改。
                        //如window.setInterval里面的l和step等可以累加或累减。
                        Snake.$movingWall.push(window.setInterval(function () {
                            //如果暂停了游戏，则墙不移动。
                            if (Snake.stop == 1) {
                                return;
                            }
                            else {
                                var _temp = wall.top;

                                (init_direction == -1 && Up.AddMovingWallPosition()) || (init_direction == 1 && Down.AddMovingWallPosition());
                                //如果墙不是第一次移动且如果移动到最大，则反向
                                if (start && (Math.abs(step) == wall.seg || step === 0)) {
                                    direction = (direction == 1 ? -1 : 1);
                                }
                                if (direction == 1) {
                                    t += Snake.TD;
                                    step++;
                                }
                                else {
                                    t -= Snake.TD;
                                    step--;
                                }
                                (init_direction == -1 && Up.AddWallPosition()) || (init_direction == 1 && Down.AddWallPosition());
                                //第一次移动后
                                if (start === 0) {
                                    start = 1;
                                }
                            }
                        }, wall.interval));
                    }
                },
                StaticWallByY: function (wall) {
                    var c = 0, t, l, n, object = null;

                    t = wall.top;
                    l = wall.left;
                    //添加墙
                    for (n = 0; n < wall.seg; n++) {
                        object = $('<span class="wall"></span>').css({ top: Snake.Top + t + "px", left: Snake.Left + l + "px" }).appendTo(Snake.$map);
                        object.left = Snake.Left + l;
                        object.top = Snake.Top + t;
                        Snake.wallseg.push(object);
                        //加入坐标对象
                        AddPosition(Snake.Left + l, Snake.Top + t, "wall");
                        c++;
                        t += Snake.TD;
                    }
                },
                StaticWallByX: function (wall) {
                    var c = 0, t, l, n, object = null;

                    t = wall.top;
                    l = wall.left;
                    //添加墙
                    for (n = 0; n < wall.seg; n++) {
                        object = $('<span class="wall"></span>').css({ top: Snake.Top + t + "px", left: Snake.Left + l + "px" }).appendTo(Snake.$map);
                        object.left = Snake.Left + l;
                        object.top = Snake.Top + t;
                        Snake.wallseg.push(object);
                        //加入坐标对象
                        AddPosition(Snake.Left + l, Snake.Top + t, "wall");
                        c++;
                        l += Snake.TD;
                    }
                }
            }
        };
        //复位
        var Clear = function (finish) {
            var k, x, y, len, len_2, left, top;

            Snake.animateTimer && window.clearInterval(Snake.animateTimer);
            Snake.animateTimer = 0;
            if (!IsOwnEmptyObject(Snake.$food)) {
                Snake.$food.hide();
            }
            for (k in Snake.$prop) {
                //隐藏道具
                Snake.$prop[k].hide();
            }
            //            console.log(" after k = " + k);
            //清除道具
            for (k = 0, len = Snake.$propFunc.length; k < len; k++) {
                //            console.log(k);
                window.clearTimeout(Snake.$propFunc[k]);
            }
            //隐藏蛇身
            for (k = 0, len = Snake.seg.length; k < len; k++) {
                if (!finish) {
                    Snake.seg[k].hide();
                }
            }
            //隐藏墙
            for (k = 0, len = Snake.wallseg.length; k < len; k++) {
                if (!finish) {
                    Snake.wallseg[k].hide();
                }
            }

            Snake.$map = $("#snake_map").css({ width: Snake.TD * Snake.WIDTH + "px",
                height: Snake.TD * Snake.HEIGHT + "px",
                border: "1px solid gray"
            });

            //释放所有坐标
            Snake.carrier = {};

            Snake.keycode = null;
            Snake.score = 0;
            Snake.level = 1;
            Snake.lives = 3;
            Snake.speed = 0;
            Snake.cherriesEaten = 0;
            //清除无敌setTimeout
            for (k = 0, len = Snake.$invincible.length; k < len; k++) {
                window.clearTimeout(Snake.$invincible[k]);
            }
            //清除移动墙setTimeout
            for (k = 0, len = Snake.$movingWall.length; k < len; k++) {
                window.clearTimeout(Snake.$movingWall[k]);
            }
            Snake.accelerate = 0;
            Snake.normal = 0;
            Snake.invincible = 0;
            Snake.start = 0;
            Snake.stop = 0;
        };
        //绑定dom元素
        var BindDom = function () {
            //绑定food元素
            Snake.$food = $('<div class="food" style=""></div>').appendTo(Snake.$map);
            Snake.$food.hide();
        };
        //初始化蛇
        var InitSnake = function () {
            Snake.speed = WallSetting[Snake.level][0].speed;
            Snake.seg = { length: WallSetting[Snake.level][0].length };

            for (var i = 0; i < Snake.seg.length; i++) {
                //蛇身：seg，保存的是dom元素
                Snake.seg[i] = $('<span class="snake"></span>').appendTo(Snake.$map);
                //蛇初始位置置为0,0
                Snake.seg[i].top = WallSetting[Snake.level][0].top + Snake.Top;     //加上偏移量
                Snake.seg[i].left = WallSetting[Snake.level][0].left + Snake.Left;  //加上偏移量
                Snake.seg[i].css({ top: Snake.seg[i].top + "px", left: Snake.seg[i].left + "px" });
                //加入到坐标对象
                AddPosition(Snake.seg[i].left, Snake.seg[i].top, "snake");
            }
        };
        //暂停游戏
        var Pause = function () {
            //开始游戏后才能暂停
            if (Snake.start) {
                if (Snake.animateTimer == 0) {
                    Snake.stop = 0; //复位暂停标志，暂停结束
                    MySnakeGame.Start();
                    Print("继续", 1000);
                } else {
                    Snake.stop = 1; //暂停标志为1，暂停开始
                    clearInterval(Snake.animateTimer);
                    Snake.animateTimer = 0;
                    Print("暂停");
                }
            }
        };
        //新游戏
        var NewGame = function (reset) {
            var score = 0, level = 1, lives = 3;

            if (reset) {
                Clear();
                Snake.start = 1;
                MySnakeGame.Set("new");
            }
            else {
                score = Snake.score;
                level = Snake.level;
                lives = Snake.lives;
                Clear();
                Snake.start = 1;
                //刷新得分
                Snake.score = score;
                //刷新关卡
                Snake.level = level;
                //刷新生命值
                Snake.lives = lives;

                MySnakeGame.Set("start");
            }
            MySnakeGame.Start();
        };
        //显示游戏结果
        var ShowResult = function (type) {
            var message = "";
            var score = Snake.score;

            message = (type == "finish" && "恭喜您，完成了游戏！<br/>") || (type == "over" && "游戏结束</br>");

            if (score <= 50) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>死得超神</strong>”<br/>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 300) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>被死亡主宰</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 600) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>菜鸟</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 900) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>大杀特杀</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 1200) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>主宰比赛</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 1800) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>妖怪般地杀戮</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else if (score <= 3000) {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>God Like！人类已经无法阻止你了</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
            else {
                Print(message
                + '您的得分为<strong>' + score + '</strong>分<br/>'
                + '获得称号“<strong>Holy Shit！求虐求教育</strong>”</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">再玩一次？</a>');
            }
        }
        //完成游戏
        var FinishedGame = function () {
            //显示结果
            ShowResult("finish");
            Clear(true);
        };
        //游戏结束
        var GameOver = function () {
            if (Snake.lives - 1) {
                Snake.lives--;
                Pause();
                Snake.start = 0;    //表示没有开始游戏，此时不能暂停
                Print("您挂了！不过您还有" + Snake.lives + "条生命！", 3000);
                window.setTimeout(function () { NewGame(); }, 3000);
                return true;
            } else {
                //提示生命为0条
                Snake.lives = 0;
                $("#stats-live").html(Snake.lives);
                //显示结果
                ShowResult("over");
                Clear(true);
                return true;
            }
        };
        var Print = function (v, time) {
            if (Snake.printTimer) {
                window.clearTimeout(Snake.printTimer);
            }
            $("#show_body").html(v);
            //过了time毫秒后隐藏提示
            if (time) {
                Snake.printTimer = window.setTimeout(function () {
                    $("#show_body").html("");
                }, time);
            }
        };
        return {
            //设置，如绑定事件等
            Set: function (type) {
                //NewGame
                if (type) {
                    //设置蛇速度、长度、初始位置
                    InitSnake();
                    //设置蛇的初始方向
                    Snake.keycode = 39;
                    //显示数值
                    $("#stats-score").html(Snake.score);
                    $("#stats-eaten").html(Snake.cherriesEaten);
                    $("#stats-speed").html(Snake.speed);
                    $("#stats-level").html(Snake.level);
                    $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);
                    $("#stats-live").html(Snake.lives);
                    $("#stats-length").html(Snake.seg.length);
                    //如果为新游戏，则提示
                    if (type == "new") {
                        Print("新游戏");
                        Snake.printTimer = window.setTimeout(function () {
                            Print("开始！", 5000);
                        }, 2000);
                    }
                    //如果为过关后开始下一关的游戏，则不提示“新游戏”
                    else if (type == "start") {
                        Print("开始！", 5000);
                    }
                    BindDom();
                    //加入绿色食物、墙、加速溜冰鞋、减速刹车
                    AddObject.Wall.Generate();   //注意顺序，墙放在最前面！
                    AddObject.Food();
                    AddObject.Prop("slow", 10000, 100000, null, 5, 10);    //减速刹车
                    AddObject.Prop("accelerate", 8000, 80000, null, 5, 10);  //加速溜冰鞋
                    AddObject.Prop("posion", 10000, 150000, null, 2, 8);  //毒药敌敌畏
                    AddObject.Prop("invincible", 1000, 120000,  //无敌药水
                    //20s后道具消失
                                        function (prop) {
                                            window.setTimeout(function () {
                                                $(prop).hide();   //隐藏道具
                                                AddPosition(prop.left, prop.top, undefined);    //清除道具坐标
                                                //                            prop = null;    //置为null
                                            }, 20000);
                                        }, 2, 4);  //2 - 4个

                    AddObject.Prop("life", 10000, 150000,  //生命之树
                    //40s后道具消失
                                        function (prop) {
                                            window.setTimeout(function () {
                                                $(prop).hide();   //隐藏道具
                                                AddPosition(prop.left, prop.top, undefined);    //清除道具坐标
                                                //                            prop = null;    //置为null
                                            }, 40000);
                                        }, 0, 3);  //0 - 3个
                    return;
                }
                //复位
                Clear();
                //绑定键盘keydown事件
                KeyboardEvent();
                //设置蛇速度、长度、初始位置
                InitSnake();
                //设置蛇的初始方向
                Snake.keycode = 39;
                //显示数值
                $("#stats-score").html(Snake.score);
                $("#stats-eaten").html(Snake.cherriesEaten);
                $("#stats-speed").html(Snake.speed);
                $("#stats-level").html(Snake.level);
                $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);
                $("#stats-live").html(Snake.lives);
                $("#stats-length").html(Snake.seg.length);
                BindDom();
                //加入绿色食物、墙、加速、减速刹车
                AddObject.Wall.Generate();   //注意顺序，墙放在最前面！
            },
            //开始
            Start: function () {
                //移动
                Snake.animateTimer = setInterval(Step, Math.floor(3000 / Snake.speed));
            },
            NewGame: NewGame,
            Clear: Clear,
            /*不能写成属性，这样的话MySnakeGame.Starting = 1;就相当于把原来的Starting属性覆盖为1了，
            并没有实现Snake.start = 1的效果！
            Starting:  Snake.start
            */
            //开始标志置为1，用于Pause()函数的判断
            Starting: function () {
                Snake.start = 1;
            }
        };
    } ());
    //定义全局入口
    window.MySnakeGame = MyGame;
} ());
//设置、绑定事件
$(function () {
    MySnakeGame.Set();
    $("#snake_start").click(function () {
        MySnakeGame.Clear();
        MySnakeGame.NewGame(true);
    });
});