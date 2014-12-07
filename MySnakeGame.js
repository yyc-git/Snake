/*
 *
 * ���ߣ�YYC
 * ����ʱ�䣺2012 �����
 * ��ϵ�ң�395976266@qq.com
 * ���ͣ�http://www.cnblogs.com/chaogex/
 */

(function () {
    /*��չString��
    ע�⣡Ҫ�ŵ���ִ������������
    */
    String.prototype.contain = function (str) {
        var reg = new RegExp(str);
        if (this.match(reg)) {  //��thisָ��ָ������
            return true;
        }
        else {
            return false;
        }
    }

    /* ���ߺ��� */
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
        //�˴�Ϊsuper�Ļ���360��Ҫ��������
        //child.super = parent.prototype;
        child.base = parent.prototype;
        return child;
    };
    var _NToM = function (over, _under) {
        if (over && _under < over) {
            throw new Error("��������");
            return;
        }
        under = _under + 1;     //�˴�Ҫ��1����Ϊ_NToM����ֻ�����over��_under-1������
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * under + 1); //û�����޵Ļ���Ĭ��Ϊ1
            case 2:
                return Math.floor(Math.random() * (under - over) + over);
            default:
                return 0;
        }
    };
    //over��under����������������num�ı���
    var _NToMByT = function (num, over, under) {
        var a = 0,
            b = 0,
            c = 0;

        switch (arguments.length) {
            case 2:
                a = Math.floor(under / num);
                b = 0;  //û�����޵Ļ���Ĭ�ϴ�0��ʼ
                c = _NToM(a, b);
                return c * num;
            case 3:
                a = Math.floor(under / num);
                b = Math.ceil(over / num);
                if (a < b) {
                    throw new Error("����over��under����num�ı���������");
                    return;
                }
                c = _NToM(b, a);
                return c * num;
            default:
                throw new Error("_NToMByT �ββ��ܳ���3��");
        }
    };

    //�����࣬���ڱ����ߵ����ԡ���ͼ��
    var Snake = {

        /* ���õ�ͼ��ȡ��߶ȡ�������Ԫ��ĸ߶ȺͿ�� */
        WIDTH: 40,  //��ͼ���Ϊ40����Ԫ��
        HEIGHT: 40, //��ͼ�߶�Ϊ40����Ԫ��
        TD: 10, //һ����Ԫ��߶ȺͿ��Ϊ10px
        /* ��ͼ�ܵĿ�Ⱥ͸߶ȣ���λΪpx�� */
        TWIDTH: function () {   //��function���棬this��ָ��Snake���������TWIDTHΪ���ԵĻ���thisָ��global
            return this.TD * this.WIDTH
        },
        THEIGHT: function () {
            return this.TD * this.HEIGHT
        },
        //�����ϴΰ�����ʱ�䣬�����ж����ΰ����ļ���Ƿ����
        date: null,
        //��ͼ
        $map: {},
        //���ض��������ж��Ƿ���ײ
        carrier: {},
        //��ɫʳ��
        $food: {},
        //���߲����ĺ���setTimeout��Ϊ����
        $propFunc: [],
        //����
        $prop: {},
        seg: {},
        wallseg: [],
        keycode: null,
        animateTimer: 0,
        //Print()
        printTimer: 0,
        //�޵�setTimeout
        $invincible: [],
        //�ƶ�ǽsetTimeout
        $movingWall: [],
        score: 0,
        level: 1,
        lives: 3,
        cherriesEaten: 0,
        //�����ڳ��������б������ǰ���ٶ�
        speed_temp: 0,
        speed: 0,
        //���ٱ�־
        accelerate: 0,
        //�����ٶȱ�־
        normal: 0,
        //�޵б�־
        invincible: 0,
        //��ʼ��Ϸ��־
        start: 0,
        //��ͣ��Ϸ��־
        stop: 0
    };
    //�ؿ����飬����ؿ�����
    var WallSetting = [
    ,   //��һ��Ԫ��Ϊ��
    [
        { cherries: 5, length: 5, speed: 5, prop: 5, //prop:������������
            top: 0, left: 0      //�߳�ʼλ��
        },

        { seg: 30, coordinate: "x", top: 200, left: 50 }
    ],
    [
        { cherries: 10, length: 7, speed: 10, prop: 5, top: 0, left: 0 },

        { seg: 30, coordinate: "x", top: 200, left: 50 },

        { seg: 10,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "y",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 50, left: 200
        },
        { seg: 10,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "x",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 250, left: 200
        }
    ],
    [
        { cherries: 10, length: 9, speed: 15, prop: 5, top: 20, left: 200 },

        { seg: 30, coordinate: "y", top: 50, left: 50 },
        { seg: 30, coordinate: "y", top: 50, left: 200 },
        { seg: 30, coordinate: "y", top: 50, left: 350 },

        { seg: 9,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "x",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 200, left: 70
        },
        { seg: 9,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "x",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
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
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "x",
            //�ƶ�����
            direction: "left",
            length: 1,
            interval: 500,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 70, left: 240
        },
        { seg: 8,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "x",
            //�ƶ�����
            direction: "right",
            length: 1,
            interval: 500,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 320, left: 160
        },
        { seg: 14,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "y",
            //�ƶ��ķ���
            direction: "up",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 280, left: 150
        },
        { seg: 14,
            //�Ƿ��ƶ�
            move: true,
            //���з���
            coordinate: "y",
            //�ƶ��ķ���
            direction: "down",
            length: 3,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
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
            interval: 500,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 130, left: 120
        },
        { seg: 12,
            move: true,
            coordinate: "x",
            direction: "left",
            length: 5,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 270, left: 280
        },
        { seg: 15,
            move: true,
            coordinate: "y",
            direction: "down",
            length: 4,
            interval: 800,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 110, left: 120
        },
        { seg: 15,
            move: true,
            coordinate: "y",
            direction: "up",
            length: 4,
            interval: 400,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 290, left: 280
        },
        { seg: 5,
            move: true,
            coordinate: "y",
            direction: "down",
            length: 4,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 0, left: 200
        },
        { seg: 5,
            move: true,
            coordinate: "y",
            direction: "up",
            length: 4,
            interval: 1000,     //�������С��100ms�������������Ϸʱ�Ϳ�������߿��Դ����ƶ�ǽ��
            top: 390, left: 200
        }
    ]
];
    //������ͼ����ִ�С�
    //�ŵ��˴�ִ�е�ԭ���ǣ�
    //��Ϊҳ������css�����˾��е���������ֻ���ڴ˴�ִ�к󣬺����$("#snake_map").offset().left���ܻ����ȷ�����ꡣ
    (function CreateMap() {
        Snake.$map = $("#snake_map").css({ width: Snake.TD * Snake.WIDTH + "px",
            height: Snake.TD * Snake.HEIGHT + "px",
            border: "1px solid gray"
        });
    } ());
    /* �������Զ�λ��ƫ���� 
            
    ���ҳ����д����������snake_map�����׸��㣬��snake_map��offsetTop��Ȼ
    Ϊsnake_map��body�ľ��룡

    <div style="line-height:1000px;">&nbsp;
    </div>
    <div style="line-height:1000px;">&nbsp;
    <span></span>
    <div id="snake_map" >
    <%--   ����--%>
    </div>
    </div>
    */

    //�����360��ie7�������������⣡�����JQuery��offset()��
    //        Top: document.getElementById("snake_map").offsetTop,
    //        Left: document.getElementById("snake_map").offsetLeft,


    //��Snake��Top��Left���Է��ڴ˴���ֵ��ʹ���ܻ����ȷ�����ꡣ
    //360(ie7)�£�TopҪ��3
    Snake.Top = $("#ie7").length > 0 ? $("#snake_map").offset().top + 3 : $("#snake_map").offset().top;
    Snake.Left = $("#snake_map").offset().left;

    /*********************************************** Ӧ��״̬ģʽ **********************************************************/

    /*

    ����ΪState�࣬����DoΪ���󷽷���

    2012 10-3

    */

    /* ���ࣨ�����ࣩ */
    function State() { };
    State.prototype = {
        Do: function () {
            throw new Error("�÷���Ϊ���󷽷������뱻��д");
        }
    };

    /* ���� */
    function SlowState() {
        Inherit(this, State);   //�̳�State��
    }
    SlowState.prototype.Do = function () {
        // �޸ķ���
        Snake.score -= 10;  //�Ե�����ɲ������10��
        $("#stats-score").html(Snake.score);

        // �ٶȹ�С���ߴ����ֶ�����ʱ�����ܼ��ٶ�
        if (Snake.speed > 10 && Snake.speed != 100) {
            Snake.speed -= 10;
            $("#stats-speed").html(Snake.speed);
        }
    };

    function AccelerateState() {
        Inherit(this, State);   //�̳�State��
    }
    AccelerateState.prototype.Do = function () {
        Snake.score += 20;
        $("#stats-score").html(Snake.score);

        if (Snake.speed < 90) {
            Snake.speed += 5;
            $("#stats-speed").html(Snake.speed);
        }
    };

    //�޵�״̬��
    //�޵�ʱ���ˢ�¡��������ڵ�0s����һ���޵�ҩˮ���5s�ֳ���һ���޵�ҩˮ��
    //���0s����5s�޵У��ҵ�5s����15s�޵С���������ֳ����޵�ҩˮ���Դ����ơ�
    function InvincibleState() {
        Inherit(this, State);   //�̳�State��
    }
    InvincibleState.prototype.Do = function (func) {
        Snake.score += 50;
        $("#stats-score").html(Snake.score);

        Snake.invincible += 1;  //���ԳԶ���޵�ҩˮ���޵�ʱ���ˢ��

        //�޵�ʱ�����10s
        Snake.$invincible.push(window.setTimeout(function () {
            if (Snake.invincible !== 0) {
                if (Snake.invincible - 1 >= 0) {
                    Snake.invincible -= 1;
                }
                else {
                    throw new Error("�޵�״̬����");
                }
            }

            //�޵�ʱ�������ִ��funcί��
            if (Snake.invincible === 0) {
                func && func("�޵�ʱ�����", 3000);
            }
        }, 10000));
    };

    //����״̬��
    //�޵�ʱ���ˢ�¡��������ڵ�0s����һ���޵�ҩˮ���5s�ֳ���һ���޵�ҩˮ��
    //���0s����5s�޵У��ҵ�5s����15s�޵С���������ֳ����޵�ҩˮ���Դ����ơ�
    function LifeState() {
        Inherit(this, State);   //�̳�State��
    }
    LifeState.prototype.Do = function (func) {
        Snake.score += 50;
        $("#stats-score").html(Snake.score);

        Snake.lives += 1;
        $("#stats-live").html(Snake.lives);
    };

    function FoodState() {
        Inherit(this, State);   //�̳�State��
    }
    FoodState.prototype.Do = function (func) {
        Snake.score += 10;
        $("#stats-score").html(Snake.score);

        Snake.cherriesEaten++;
        //ˢ����ʾ
        $("#stats-eaten").html(Snake.cherriesEaten);
        $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);

        if (Snake.speed < 90) {
            Snake.speed += 2;
            $("#stats-speed").html(Snake.speed);
        }

        func && func("�Ե���ɫʳ��", 2000);

        Snake.seg.length++;
        $("#stats-length").html(Snake.seg.length);
    };

    //������
    var State_Context = (function () {
        return {
            SlowState: (function () {
                var state = null;
                //����ģʽ
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
                        //�˴������߼��ж�
                        GetInstance().Do();
                    }
                }
            } ()),
            AccelerateState: (function () {
                var state = null;
                //����ģʽ
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
                        //�˴������߼��ж�
                        GetInstance().Do();
                    }
                }
            } ()),
            InvincibleState: (function () {
                var state = null;
                //����ģʽ
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
                        //�˴������߼��ж�
                        GetInstance().Do(func);
                    }
                }
            } ()),
            LifeState: (function () {
                var state = null;
                //����ģʽ
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
                        //�˴������߼��ж�
                        GetInstance().Do(func);
                    }
                }
            } ()),
            FoodState: (function () {
                var state = null;
                //����ģʽ
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
                        //�˴������߼��ж�
                        GetInstance().Do(func);
                    }
                }
            } ())
        }
    } ());
    /*********************************************** ���� *************************************************************/

    //��Ϸ����
    MyGame = (function () {
        //������꼰name
        //Snake.carrierʹ��Object�������洢
        var AddPosition = function (left, top, name) {
            //            //�������
            //            if (arguments.length == 2 && arguments[1] == "clear"){
            //                Snake.carrier = {};
            //                return;
            //            }

            //���Snake.carrier[left]Ϊundefine����ֱ�����Snake.carrier[left][top] = name;Ҫ��������
            if (!Snake.carrier[left]) {
                Snake.carrier[left] = {};
            }
            Snake.carrier[left][top] = name;
        };
        //�󶨼����¼�
        var KeyboardEvent = function () {
            document.onkeydown = function (_e) {
                var keycode = (_e == null) ? event.keyCode : _e.which;
                var e = _e ? _e : window.event; //����ie�����������
                var new_date = null, interval = null;
                //���ⲿ�ִ����Ƶ�if���棬ʹ�ü�ʹSnake.start������1������Ϸδ��ʼ����Ҳ���԰���N������������Ϸ
                switch (keycode) {
                    case 78:
                        if (!-[1,]) {     //ie�������ֹ��������ƹ���������
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
                if (Snake.start == 1) {     //��Ϸ��ʼ�������������keydown�¼�
                    if (Snake.date) {   //��һ���ƶ�ʱ�������������ڶ����ƶ�ʱ�ſ�ʼ���㡣
                        new_date = new Date();
                        interval = new_date.getTime() - Snake.date.getTime();   //���ϴΰ����ļ��
                        //���һֱ������Ӧ�ķ�������ţ������
                        if (interval < 50 && keycode == Snake.keycode) {
                            if (Snake.speed != 100) {
                                Snake.speed_temp = Snake.speed; //�������ǰ���ٶ�
                                Snake.speed = 100;
                                Snake.accelerate = 1;   //�ü��ٱ�־Ϊ1
                                $("#stats-speed").html(Snake.speed);
                                Print("����", 2000);
                            }
                        }
                        //��ֹ���С���ƶ�����Ĳ���
                        if (interval < 3000 / (Snake.speed + 10)) {
                            return false;
                        }
                    }
                    Snake.date = new Date();    //���汾�ΰ���ʱ�䣬���ڼ������ΰ���ʱ��ļ��
                    //$.browser.msie���ж������Ϊie�����
                    switch (keycode) {
                        case 80:
                            if (!-[1,]) {     //ie�������ֹ��������ƹ���������
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
                            if (!-[1,]) {     //ie�������ֹ��������ƹ���������
                                e.returnValue = false;
                            }
                            else {
                                e.preventDefault();
                            }

                            //��ֹ����ǰ������������ʱ���������ߣ�������ʱ���������ߵȣ�
                            if (
            			keycode == 37 && Snake.keycode == 39 ||
            			keycode == 39 && Snake.keycode == 37 ||
            			keycode == 38 && Snake.keycode == 40 ||
            			keycode == 40 && Snake.keycode == 38
            		) {
                                //����ߴ��ڼ���״̬�Ұ��˷�����������ٶȻָ�����
                                if (Snake.speed == 100) {
                                    Snake.speed = Snake.speed_temp;

                                    Snake.accelerate = 0;   //�ü��ٱ�־Ϊ0
                                    Snake.normal = 1;   //�������ٶȱ�־λ1
                                    $("#stats-speed").html(Snake.speed);
                                    Print("�����ٶ�", 2000);
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
        //�ƶ����߼��ж�
        var Step = function () {
            var name = "";
            var keycode = Snake.keycode;
            var wall = 0;   //��ǽ��־

            //�������ȫ����ʾ�ڵ�ͼ���ˣ����ͷ���β���ꡣ
            //seg[1]����β��
            if (Snake.seg[1].left != Snake.seg[2].left || Snake.seg[1].top != Snake.seg[2].top) {
                //                //�����β����ǽ���棨�޵�״̬�������ͷ���β������
                //                if (!JudgeHit(Snake.seg[1], "wall") && !JudgeHit(Snake.seg[1], "movingWall")) {
                //                    AddPosition(Snake.seg[1].left, Snake.seg[1].top, undefined);
                //                }
                if (JudgeHit(Snake.seg[1], "snake")) {
                    AddPosition(Snake.seg[1].left, Snake.seg[1].top, undefined);
                }
            }

            //�������seg[0]��������ǰ��		
            for (var i = 1; i < Snake.seg.length; i++) {
                Snake.seg[i].top = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].top;
                Snake.seg[i].left = Snake.seg[(i == Snake.seg.length - 1 ? 0 : i + 1)].left;
            }
            //seg[0]����ͷ
            if (keycode == 39) {    //��
                Snake.seg[0].left += Snake.TD;
                if (Snake.seg[0].left > (Snake.TWIDTH() + Snake.Left - Snake.TD)) {
                    //���GameOver�����˳��ú���
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].left = Snake.Left;
                }
            } else if (keycode == 40) {     //��
                Snake.seg[0].top += Snake.TD;
                if (Snake.seg[0].top > (Snake.THEIGHT() + Snake.Top - Snake.TD)) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].top = Snake.Top;
                }
            } else if (keycode == 38) {     //��
                Snake.seg[0].top -= Snake.TD;
                if (Snake.seg[0].top < Snake.Top) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].top = Snake.Top + Snake.THEIGHT() - Snake.TD;
                }
            } else if (keycode == 37) {     //��
                Snake.seg[0].left -= Snake.TD;
                if (Snake.seg[0].left < Snake.Left) {
                    if (!Snake.invincible && GameOver()) {
                        return;
                    }
                    Snake.seg[0].left = Snake.Left + Snake.TWIDTH() - Snake.TD;
                }
            }
            //�Ե�ʳ��
            (JudgeHit(Snake.seg[0], "food")) &&
			Advance();
            //ײ���Լ�
            if ((JudgeHit(Snake.seg[0], "snake")) && GameOver()) {
                return;
            }
            //ײ��ǽ
            if ((JudgeHit(Snake.seg[0], "wall"))) {
                if (!Snake.invincible && GameOver()) {
                    return;
                }
                //�޵�
                else if (Snake.invincible) {
                    //�ô�ǽ��־Ϊ1�������ж��Ƿ񱣳�ǽ������
                    wall = 1;
                }
            }
            //�Ե�����ɲ��
            if (JudgeHit(Snake.seg[0], "slow")) {
                Print("��ü���ɲ��", 2000);
                //���ص���
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //��λ������Ϊ��ռ��
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //�������״̬
                State_Context.SlowState.Do();

                RefreshAndWalk();
            }
            //�Ե��������Ь
            if (JudgeHit(Snake.seg[0], "accelerate")) {
                Print("��ü������Ь", 2000);
                //���ص���
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //��λ������Ϊ��ռ��
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //�������״̬
                State_Context.AccelerateState.Do();

                RefreshAndWalk();
            }
            //�Ե���ҩ�е�η
            if (JudgeHit(Snake.seg[0], "posion")) {
                if (!Snake.invincible && GameOver()) {
                    return;
                }
                //���ص���
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //��λ������Ϊ��ռ��
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
            }
            //�Ե��޵�ҩˮ
            if (JudgeHit(Snake.seg[0], "invincible")) {
                Print("����޵�ҩˮ��10s���޵�", 2000);
                //���ص���
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //��λ������Ϊ��ռ��
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //�����޵�״̬
                State_Context.InvincibleState.Do(Print);
            }
            //�Ե�����֮��
            if (JudgeHit(Snake.seg[0], "life")) {
                Print("�������֮����������1", 2000);
                //���ص���
                name = Snake.carrier[Snake.seg[0].left][Snake.seg[0].top];
                Snake.$prop[name].hide();
                //��λ������Ϊ��ռ��
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
                //��������״̬
                State_Context.LifeState.Do();
            }
            //������һ��
            (Snake.cherriesEaten == WallSetting[Snake.level][0].cherries) &&
                        			AdvanceLevel();
            //�ض�λ��
            for (var i = 0; i < Snake.seg.length; i++) {
                Snake.seg[i].css({ top: Snake.seg[i].top + "px", left: Snake.seg[i].left + "px" });
            }
            //���û�д����޵�״̬������ǽ����û�������ƶ�ǽ����������ͷ������
            if (!wall && !JudgeHit(Snake.seg[0], "movingWall")) {
                AddPosition(Snake.seg[0].left, Snake.seg[0].top, "snake");
            }
            //����������ٻ򰴷�������ָ������ٶȣ���ˢ���ٶ�
            if (Snake.accelerate == 1 || Snake.normal == 1) {
                RefreshAndWalk();
            }
        };
        //�Ե�ʳ��߳��ȼ�1
        var Advance = function (val) {
            //����food״̬
            State_Context.FoodState.Do();

            var x = Snake.seg.length - 1;
            //���ӵ������domԪ��
            Snake.seg[x] = $('<span class="snake"></span>')
		.css({ left: Snake.seg[1].left + "px", top: Snake.seg[1].top + "px" })
		.appendTo(Snake.$map);
            //��λ�����ӵ�����
            Snake.seg[x].top = Snake.seg[x - 1].top;
            Snake.seg[x].left = Snake.seg[x - 1].left;
            //�����ӵ�������������
            AddPosition(Snake.seg[x].left, Snake.seg[x].top, "snake");
            //�������ʳ��
            AddObject.Food();
            //ˢ��
            RefreshAndWalk();

            return false;
        };
        //ˢ�����ٶȲ��ƶ�
        var RefreshAndWalk = function () {
            if (Snake.animateTimer) {
                clearInterval(Snake.animateTimer);
            }
            Snake.animateTimer = setInterval(Step, Math.floor(3000 / Snake.speed));
        };
        //���أ�������һ��
        var AdvanceLevel = function () {
            if (Snake.level == WallSetting.length - 1) {
                FinishedGame();
            } else {
                Snake.level++;
                Snake.speed = WallSetting[Snake.level][0].speed;
                //��ΪNewGame��Ȼ�����ü��١����ٱ�־�������ӳ�3��ŵ��ã��ڼ��߿��ܽ������ƶ���
                //�������ֶ����ü��١����ٱ�־Ϊ0
                Snake.accelerate = 0;
                Snake.normal = 0;

                Pause();

                Print("�����" + Snake.level + "��  ����" + Snake.lives + "������  " + "����Ҫ�Ե�" + WallSetting[Snake.level][0].cherries + "����ɫʳ����ܹ��أ�", 3000);
                /* ����д���������NewGame(reset)���β�reset��Ϊundefined����Ϊһ�����֣�Ϊʲô�����֣���
                window.setTimeout(NewGame, 3000);
                */
                window.setTimeout(function () { NewGame(); }, 3000);
            }
        };
        //�ж��Ƿ���ײ
        var JudgeHit = function (obj_needle, name) {
            if (name) {
                //����������и���Ʒ�����ж�Ϊ��ײ��
                //������contain��ԭ���ǵ��������ɲ���ȣ��������ֿ���Ϊslow0��slow1�ȣ�
                //���˴���������nameΪslow�������contain���жϡ�
                if (Snake.carrier[obj_needle.left] && Snake.carrier[obj_needle.left][obj_needle.top]
                    && Snake.carrier[obj_needle.left][obj_needle.top].contain(name)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (Snake.carrier[obj_needle.left] && Snake.carrier[obj_needle.left][obj_needle.top]) {   //�������������Ʒ�����ж�Ϊ��ײ
                    return true;
                }
                else {
                    return false;
                }
            }
        };
        //����ָ����Χ����㣨Snake.TD�ı�����
        var randomPointer = function (startX, startY, endX, endY) {
            var startX = (startX) || 0;
            var startY = (startY) || 0;
            var endX = endX || (parseInt(Snake.TWIDTH()) - Snake.TD);    //Ҫ-Snake.TD��������ܳ����߽�
            var endY = endY || (parseInt(Snake.THEIGHT()) - Snake.TD);    //Ҫ-Snake.TD��������ܳ����߽�
            var p = {},
            x = Snake.Left + _NToMByT(Snake.TD, startX, endX),   //�ڴ˴�����ƫ������
            y = Snake.Top + _NToMByT(Snake.TD, startY, endY);

            p.left = x;
            p.top = y;

            if (JudgeHit(p)) {
                return randomPointer(startX, startY, endX, endY);    //������������괦�����˶�������ݹ�
            }
            return p;
        };
        //�����������
        var randomNum = function (over, under) {
            return _NToM(over, under);
        };
        //�����Ʒ���ϰ�
        var AddObject = {
            //�ж����ɵ������Ƿ����ߵĸ�����
            //������ɵ�������������ͷ������Ϊ���ģ�����Ϊ2 * range�������η�Χ�ڣ�
            //���ж�Ϊ�ڸ�����
            JudgeAroundSnake: function (position, range) {
                if (Math.abs(position.left - Snake.seg[0].left) < range && Math.abs(position.top - Snake.seg[0].top) < range) {
                    return true;
                }
                else {
                    return false;
                }
            },
            //����������겢���
            Add: function (object, name) {
                var position = null;
                //���߻���������겻�����߸���
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
            //���ɵ���
            Prop: function (_name, time_over, time_under, func, _num_over, _num_under) {
                //���ɵ��ߵ��������
                //Ĭ��Ϊ1��5����
                //���ֻ������_num_over��û������_num_under��������_num_over����
                var num = _num_over ? (_num_under ? randomNum(_num_over, _num_under) : _num_over) : randomNum(1, 5);
                var prop = {}, prop_position = {}, left = 0, top = 0, position = null, _this = this, object = null;
                var name = "";
                var k = 0;

                for (var i = 0; i < num; i++) {
                    Snake.$propFunc.push(window.setTimeout(function PropTime() {
                        //�����ǰ״̬Ϊ��ͣ����PropTime���β�ִ�У�
                        //�ӳٵ�randomNum(time_over, time_under)ʱ�����ִ�С�
                        //ʹ�õݹ�ʵ�֡�
                        if (Snake.stop == 1) {
                            Snake.$propFunc.push(window.setTimeout(function () { PropTime(); }, randomNum(time_over, time_under)));
                            return;
                        }
                        //�Ѽ�����ŵĴ���ŵ�setTimeout�У��������ܱ�֤�ǰ�˳��ӵ���š�
                        name = _name + k.toString();
                        object = $('<span class="' + _name + '"></span>').appendTo(Snake.$map); //����������ԭʼ��_name
                        position = _this.Add(object);
                        //���Ϊ��ӵ��ߣ�����$prop��������߶���
                        //�˴�nameΪ������ŵ����֣���slow0��slow1��
                        Snake.$prop[name] = object;
                        Snake.$prop[name].left = position.left;
                        Snake.$prop[name].top = position.top;

                        AddPosition(position.left, position.top, name);
                        //����ί��
                        func && func(Snake.$prop[name]);

                        k++;    //��ż�1
                        return;
                    }, randomNum(time_over, time_under)));
                }
            },
            Wall: {
                Generate: function () {
                    var walls = WallSetting[Snake.level], i;
                    //���ǽ
                    for (i = 1; i < walls.length; i++) {
                        if (walls[i].move) {    //�ж�Ϊ�ƶ�ǽ���Ǿ�ֹ��ǽ
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
                //�����ƶ���ǽ
                //��ͷ�����ƶ���ǽ����gameover������������ǽ����Ӱ��
                MovingWallByX: function (wall) {
                    var c = 0, t = 0, l = 0, n = 0,
                    step = 0,   //�ƶ��Ĳ���
                    start = 0,  //��һ���ƶ��ı�־
                    temp = 0, object = [], len = 0,
                    direction = wall.direction ? (wall.direction == "left" ? -1 : 1) : 1,  //Ĭ��Ϊ�����ƶ�
                    init_direction = direction; //����ǽָ���ƶ��ķ���

                    len = wall.length;  //ǽ�Ŀ��
                    t = wall.top;
                    l = wall.left;
                    temp = wall.left;

                    var Right = {
                        AddWall: function () {
                            //object[0]���Կ���ǽͷ��ǽ����ǽͷ��ʼ���±߿�ʼ���
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + "px", left: Snake.Left + l + k * Snake.TD + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //ǽ�ƶ��ķ�Χ�ڶ��ȼ��뵽��������У���Ϊ"movingWall"���������ɷ�ֹ���߻����������ǽ�ƶ��ķ�Χ��
                            //ע�⣡�˴�Ҫ����ǽ�Ŀ��len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + wall.left + n * Snake.TD, Snake.Top + t, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //��ǽ��������Ϊ"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + "px", left: Snake.Left + l + i * Snake.TD + "px" });
                                AddPosition(Snake.Left + l + i * Snake.TD, Snake.Top + t, "wall");
                            }
                        }
                    };
                    var Left = {
                        AddWall: function () {
                            //object[0]���Կ���ǽͷ��ǽ����ǽͷ��ʼ���ϱ߿�ʼ���
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + "px", left: Snake.Left + l - k * Snake.TD + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //ǽ�ƶ��ķ�Χ�ڶ��ȼ��뵽��������У���Ϊ"movingWall"���������ɷ�ֹ���߻����������ǽ�ƶ��ķ�Χ��
                            //ע�⣡�˴�Ҫ����ǽ�Ŀ��len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + wall.left - n * Snake.TD, Snake.Top + t, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //��ǽ��������Ϊ"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + "px", left: Snake.Left + l - i * Snake.TD + "px" });
                                AddPosition(Snake.Left + l - i * Snake.TD, Snake.Top + t, "wall");
                            }
                        }
                    };
                    (init_direction == -1 && Left.AddMovingWallPosition()) || (init_direction == 1 && Right.AddMovingWallPosition());
                    (init_direction == -1 && Left.AddWall()) || (init_direction == 1 && Right.AddWall());
                    if (Snake.start == 1) {     //��Ϸ��ʼ���ƶ�ǽ���ܿ�ʼ�ƶ�
                        //MovingWall�ľֲ�������window.setInterval��˵�൱��ȫ�ֱ�����
                        //�������Ǳհ������Ա����MovingWall�ľֲ��������޸ġ�
                        //��window.setInterval�����l��step�ȿ����ۼӻ��ۼ���
                        Snake.$movingWall.push(window.setInterval(function () {
                            //�����ͣ����Ϸ����ǽ���ƶ���
                            if (Snake.stop == 1) {
                                return;
                            }
                            else {
                                (init_direction == -1 && Left.AddMovingWallPosition()) || (init_direction == 1 && Right.AddMovingWallPosition());
                                //���ǽ���ǵ�һ���ƶ�������ƶ����������
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
                                //��һ���ƶ���
                                if (start === 0) {
                                    start = 1;
                                }
                            }
                        }, wall.interval));
                    }
                },
                //�����ƶ���ǽ
                //��ͷ�����ƶ���ǽ����gameover������������ǽ����Ӱ��
                MovingWallByY: function (wall) {
                    var c = 0, t = 0, l = 0, n = 0,
                    step = 0,
                    temp = 0, object = [], len = 0,
                    start = 0,  //ǽ��һ���ƶ��ı�־
                    direction = wall.direction ? (wall.direction == "up" ? -1 : 1) : 1,
                    init_direction = direction; //����ǽָ���ƶ��ķ���

                    len = wall.length;  //ǽ�Ŀ��
                    t = wall.top;
                    l = wall.left;
                    temp = wall.top;

                    var Down = {
                        AddWall: function () {
                            //object[0]���Կ���ǽͷ��ǽ����ǽͷ��ʼ���±߿�ʼ���
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t + k * Snake.TD + "px", left: Snake.Left + l + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //ǽ�ƶ��ķ�Χ�ڶ��ȼ��뵽��������У���Ϊ"movingWall"���������ɷ�ֹ���߻����������ǽ�ƶ��ķ�Χ��
                            //ע�⣡�˴�Ҫ����ǽ�Ŀ��len
                            for (var n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + l, Snake.Top + wall.top + n * Snake.TD, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //��ǽ��������Ϊ"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t + i * Snake.TD + "px", left: Snake.Left + l + "px" });
                                AddPosition(Snake.Left + l, Snake.Top + t + i * Snake.TD, "wall");
                            }
                        }
                    };
                    var Up = {
                        AddWall: function () {
                            //object[0]���Կ���ǽͷ��ǽ����ǽͷ��ʼ���ϱ߿�ʼ���
                            for (var k = 0; k < len; k++) {
                                object[k] = $('<span class="wall"></span>').appendTo(Snake.$map);
                                object[k].left = Snake.Left + l;
                                object[k].top = Snake.Top + t;
                                Snake.wallseg.push(object[k]);
                                object[k].css({ top: Snake.Top + t - k * Snake.TD + "px", left: Snake.Left + l + "px" });
                            }
                        },
                        AddMovingWallPosition: function () {
                            //ǽ�ƶ��ķ�Χ�ڶ��ȼ��뵽��������У���Ϊ"movingWall"���������ɷ�ֹ���߻����������ǽ�ƶ��ķ�Χ��
                            //ע�⣡�˴�Ҫ����ǽ�Ŀ��len
                            for (n = 0; n < wall.seg + len; n++) {
                                AddPosition(Snake.Left + l, Snake.Top + wall.top - n * Snake.TD, "movingWall");
                            }
                        },
                        AddWallPosition: function () {
                            //��ǽ��������Ϊ"wall"
                            for (var i = 0; i < len; i++) {
                                object[i].css({ top: Snake.Top + t - i * Snake.TD + "px", left: Snake.Left + l + "px" });
                                AddPosition(Snake.Left + l, Snake.Top + t - i * Snake.TD, "wall");
                            }
                        }
                    };
                    (init_direction == -1 && Up.AddMovingWallPosition()) || (init_direction == 1 && Down.AddMovingWallPosition());
                    (init_direction == -1 && Up.AddWall()) || (init_direction == 1 && Down.AddWall());
                    if (Snake.start == 1) {     //��Ϸ��ʼ���ƶ�ǽ���ܿ�ʼ�ƶ�
                        //MovingWall�ľֲ�������window.setInterval��˵�൱��ȫ�ֱ�����
                        //�������Ǳհ������Ա����MovingWall�ľֲ��������޸ġ�
                        //��window.setInterval�����l��step�ȿ����ۼӻ��ۼ���
                        Snake.$movingWall.push(window.setInterval(function () {
                            //�����ͣ����Ϸ����ǽ���ƶ���
                            if (Snake.stop == 1) {
                                return;
                            }
                            else {
                                var _temp = wall.top;

                                (init_direction == -1 && Up.AddMovingWallPosition()) || (init_direction == 1 && Down.AddMovingWallPosition());
                                //���ǽ���ǵ�һ���ƶ�������ƶ����������
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
                                //��һ���ƶ���
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
                    //���ǽ
                    for (n = 0; n < wall.seg; n++) {
                        object = $('<span class="wall"></span>').css({ top: Snake.Top + t + "px", left: Snake.Left + l + "px" }).appendTo(Snake.$map);
                        object.left = Snake.Left + l;
                        object.top = Snake.Top + t;
                        Snake.wallseg.push(object);
                        //�����������
                        AddPosition(Snake.Left + l, Snake.Top + t, "wall");
                        c++;
                        t += Snake.TD;
                    }
                },
                StaticWallByX: function (wall) {
                    var c = 0, t, l, n, object = null;

                    t = wall.top;
                    l = wall.left;
                    //���ǽ
                    for (n = 0; n < wall.seg; n++) {
                        object = $('<span class="wall"></span>').css({ top: Snake.Top + t + "px", left: Snake.Left + l + "px" }).appendTo(Snake.$map);
                        object.left = Snake.Left + l;
                        object.top = Snake.Top + t;
                        Snake.wallseg.push(object);
                        //�����������
                        AddPosition(Snake.Left + l, Snake.Top + t, "wall");
                        c++;
                        l += Snake.TD;
                    }
                }
            }
        };
        //��λ
        var Clear = function (finish) {
            var k, x, y, len, len_2, left, top;

            Snake.animateTimer && window.clearInterval(Snake.animateTimer);
            Snake.animateTimer = 0;
            if (!IsOwnEmptyObject(Snake.$food)) {
                Snake.$food.hide();
            }
            for (k in Snake.$prop) {
                //���ص���
                Snake.$prop[k].hide();
            }
            //            console.log(" after k = " + k);
            //�������
            for (k = 0, len = Snake.$propFunc.length; k < len; k++) {
                //            console.log(k);
                window.clearTimeout(Snake.$propFunc[k]);
            }
            //��������
            for (k = 0, len = Snake.seg.length; k < len; k++) {
                if (!finish) {
                    Snake.seg[k].hide();
                }
            }
            //����ǽ
            for (k = 0, len = Snake.wallseg.length; k < len; k++) {
                if (!finish) {
                    Snake.wallseg[k].hide();
                }
            }

            Snake.$map = $("#snake_map").css({ width: Snake.TD * Snake.WIDTH + "px",
                height: Snake.TD * Snake.HEIGHT + "px",
                border: "1px solid gray"
            });

            //�ͷ���������
            Snake.carrier = {};

            Snake.keycode = null;
            Snake.score = 0;
            Snake.level = 1;
            Snake.lives = 3;
            Snake.speed = 0;
            Snake.cherriesEaten = 0;
            //����޵�setTimeout
            for (k = 0, len = Snake.$invincible.length; k < len; k++) {
                window.clearTimeout(Snake.$invincible[k]);
            }
            //����ƶ�ǽsetTimeout
            for (k = 0, len = Snake.$movingWall.length; k < len; k++) {
                window.clearTimeout(Snake.$movingWall[k]);
            }
            Snake.accelerate = 0;
            Snake.normal = 0;
            Snake.invincible = 0;
            Snake.start = 0;
            Snake.stop = 0;
        };
        //��domԪ��
        var BindDom = function () {
            //��foodԪ��
            Snake.$food = $('<div class="food" style=""></div>').appendTo(Snake.$map);
            Snake.$food.hide();
        };
        //��ʼ����
        var InitSnake = function () {
            Snake.speed = WallSetting[Snake.level][0].speed;
            Snake.seg = { length: WallSetting[Snake.level][0].length };

            for (var i = 0; i < Snake.seg.length; i++) {
                //����seg���������domԪ��
                Snake.seg[i] = $('<span class="snake"></span>').appendTo(Snake.$map);
                //�߳�ʼλ����Ϊ0,0
                Snake.seg[i].top = WallSetting[Snake.level][0].top + Snake.Top;     //����ƫ����
                Snake.seg[i].left = WallSetting[Snake.level][0].left + Snake.Left;  //����ƫ����
                Snake.seg[i].css({ top: Snake.seg[i].top + "px", left: Snake.seg[i].left + "px" });
                //���뵽�������
                AddPosition(Snake.seg[i].left, Snake.seg[i].top, "snake");
            }
        };
        //��ͣ��Ϸ
        var Pause = function () {
            //��ʼ��Ϸ�������ͣ
            if (Snake.start) {
                if (Snake.animateTimer == 0) {
                    Snake.stop = 0; //��λ��ͣ��־����ͣ����
                    MySnakeGame.Start();
                    Print("����", 1000);
                } else {
                    Snake.stop = 1; //��ͣ��־Ϊ1����ͣ��ʼ
                    clearInterval(Snake.animateTimer);
                    Snake.animateTimer = 0;
                    Print("��ͣ");
                }
            }
        };
        //����Ϸ
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
                //ˢ�µ÷�
                Snake.score = score;
                //ˢ�¹ؿ�
                Snake.level = level;
                //ˢ������ֵ
                Snake.lives = lives;

                MySnakeGame.Set("start");
            }
            MySnakeGame.Start();
        };
        //��ʾ��Ϸ���
        var ShowResult = function (type) {
            var message = "";
            var score = Snake.score;

            message = (type == "finish" && "��ϲ�����������Ϸ��<br/>") || (type == "over" && "��Ϸ����</br>");

            if (score <= 50) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>���ó���</strong>��<br/>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 300) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>����������</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 600) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>����</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 900) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>��ɱ��ɱ</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 1200) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>���ױ���</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 1800) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>���ְ��ɱ¾</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else if (score <= 3000) {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>God Like�������Ѿ��޷���ֹ����</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
            else {
                Print(message
                + '���ĵ÷�Ϊ<strong>' + score + '</strong>��<br/>'
                + '��óƺš�<strong>Holy Shit����Ű�����</strong>��</br>'
                + '<a href="javascript:void(0);" onclick="MySnakeGame.NewGame(true);">����һ�Σ�</a>');
            }
        }
        //�����Ϸ
        var FinishedGame = function () {
            //��ʾ���
            ShowResult("finish");
            Clear(true);
        };
        //��Ϸ����
        var GameOver = function () {
            if (Snake.lives - 1) {
                Snake.lives--;
                Pause();
                Snake.start = 0;    //��ʾû�п�ʼ��Ϸ����ʱ������ͣ
                Print("�����ˣ�����������" + Snake.lives + "��������", 3000);
                window.setTimeout(function () { NewGame(); }, 3000);
                return true;
            } else {
                //��ʾ����Ϊ0��
                Snake.lives = 0;
                $("#stats-live").html(Snake.lives);
                //��ʾ���
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
            //����time�����������ʾ
            if (time) {
                Snake.printTimer = window.setTimeout(function () {
                    $("#show_body").html("");
                }, time);
            }
        };
        return {
            //���ã�����¼���
            Set: function (type) {
                //NewGame
                if (type) {
                    //�������ٶȡ����ȡ���ʼλ��
                    InitSnake();
                    //�����ߵĳ�ʼ����
                    Snake.keycode = 39;
                    //��ʾ��ֵ
                    $("#stats-score").html(Snake.score);
                    $("#stats-eaten").html(Snake.cherriesEaten);
                    $("#stats-speed").html(Snake.speed);
                    $("#stats-level").html(Snake.level);
                    $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);
                    $("#stats-live").html(Snake.lives);
                    $("#stats-length").html(Snake.seg.length);
                    //���Ϊ����Ϸ������ʾ
                    if (type == "new") {
                        Print("����Ϸ");
                        Snake.printTimer = window.setTimeout(function () {
                            Print("��ʼ��", 5000);
                        }, 2000);
                    }
                    //���Ϊ���غ�ʼ��һ�ص���Ϸ������ʾ������Ϸ��
                    else if (type == "start") {
                        Print("��ʼ��", 5000);
                    }
                    BindDom();
                    //������ɫʳ�ǽ���������Ь������ɲ��
                    AddObject.Wall.Generate();   //ע��˳��ǽ������ǰ�棡
                    AddObject.Food();
                    AddObject.Prop("slow", 10000, 100000, null, 5, 10);    //����ɲ��
                    AddObject.Prop("accelerate", 8000, 80000, null, 5, 10);  //�������Ь
                    AddObject.Prop("posion", 10000, 150000, null, 2, 8);  //��ҩ�е�η
                    AddObject.Prop("invincible", 1000, 120000,  //�޵�ҩˮ
                    //20s�������ʧ
                                        function (prop) {
                                            window.setTimeout(function () {
                                                $(prop).hide();   //���ص���
                                                AddPosition(prop.left, prop.top, undefined);    //�����������
                                                //                            prop = null;    //��Ϊnull
                                            }, 20000);
                                        }, 2, 4);  //2 - 4��

                    AddObject.Prop("life", 10000, 150000,  //����֮��
                    //40s�������ʧ
                                        function (prop) {
                                            window.setTimeout(function () {
                                                $(prop).hide();   //���ص���
                                                AddPosition(prop.left, prop.top, undefined);    //�����������
                                                //                            prop = null;    //��Ϊnull
                                            }, 40000);
                                        }, 0, 3);  //0 - 3��
                    return;
                }
                //��λ
                Clear();
                //�󶨼���keydown�¼�
                KeyboardEvent();
                //�������ٶȡ����ȡ���ʼλ��
                InitSnake();
                //�����ߵĳ�ʼ����
                Snake.keycode = 39;
                //��ʾ��ֵ
                $("#stats-score").html(Snake.score);
                $("#stats-eaten").html(Snake.cherriesEaten);
                $("#stats-speed").html(Snake.speed);
                $("#stats-level").html(Snake.level);
                $("#stats-food").html(WallSetting[Snake.level][0].cherries - Snake.cherriesEaten);
                $("#stats-live").html(Snake.lives);
                $("#stats-length").html(Snake.seg.length);
                BindDom();
                //������ɫʳ�ǽ�����١�����ɲ��
                AddObject.Wall.Generate();   //ע��˳��ǽ������ǰ�棡
            },
            //��ʼ
            Start: function () {
                //�ƶ�
                Snake.animateTimer = setInterval(Step, Math.floor(3000 / Snake.speed));
            },
            NewGame: NewGame,
            Clear: Clear,
            /*����д�����ԣ������Ļ�MySnakeGame.Starting = 1;���൱�ڰ�ԭ����Starting���Ը���Ϊ1�ˣ�
            ��û��ʵ��Snake.start = 1��Ч����
            Starting:  Snake.start
            */
            //��ʼ��־��Ϊ1������Pause()�������ж�
            Starting: function () {
                Snake.start = 1;
            }
        };
    } ());
    //����ȫ�����
    window.MySnakeGame = MyGame;
} ());
//���á����¼�
$(function () {
    MySnakeGame.Set();
    $("#snake_start").click(function () {
        MySnakeGame.Clear();
        MySnakeGame.NewGame(true);
    });
});