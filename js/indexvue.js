var vue = new Vue({
    el: '#app',
    data: {
        userId: '',
        newEvent: {
            eventname: '无标题清单',
            event: []
        },
        tempEventName: '',
        groupIndex: 0, //0为myDay，1为toDo，2为events
        eventIndex: 0,
        myDay: {
            eventname: '我的一天',
            event: []
        },
        toDo: {
            eventname: 'To-Do',
            event: []
        },
        events: [],
        isTitleEdit: true,
        isLoaded: false,
        hidedone: false,
        issearch: false,
        tempEditEventName: '',
        tempEditEventTime: '',
        tempEditEventIndex: 0,
        tempAddToMyDayBtn: '添加到“我的一天”',
        aEvent: {
            name: '',
            done: false,
            time: '',
        },
        searchtext: '',
        themes: [{
            themename: '悠悠蓝',
            style: {
                evemenu: '#4b7fdf',
                evetitle: '#FFFFFF',
                back: './images/indexback.jpg'
            }
        }, {
            themename: '基佬紫',
            style: {
                evemenu: '#e6e6fa',
                evetitle: '#20B2AA',
                back: './images/indexback2.jpg'
            }
        }, {
            themename: '困困绿',
            style: {
                evemenu: '#4EEE94',
                evetitle: '#2F4F4F',
                back: './images/indexback3.jpg'
            }
        }, {
            themename: '野心勃勃',
            style: {
                evemenu: '#00688B',
                evetitle: '#8DEEEE',
                back: './images/indexback4.jpg'
            }
        }],
    },
    methods: {
        ClickEvent: function(index) { //单击清单，然后显示清单列表
            this.eventIndex = index;
        },
        GetEvent: function() { //获取清单名称
            if (this.events.length <= 0 && this.groupIndex === 2)
                return;
            if (this.groupIndex === 0)
                return this.myDay.eventname;
            else if (this.groupIndex === 1)
                return this.toDo.eventname
            else
                return this.events[this.eventIndex].eventname;
        },
        GetEvents: function() { //获取索引的清单列表
            if (this.events.length <= 0 && this.groupIndex === 2)
                return;
            if (this.groupIndex === 0)
                return this.myDay.event;
            else if (this.groupIndex == 1)
                return this.toDo.event;
            else
                return this.events[this.eventIndex].event;
        },
        getTempEventName: function() {
            if (this.groupIndex === 2)
                this.tempEventName = this.events[this.eventIndex].eventname;
        },
        AddEventList: function() { //增加清单
            var mevent = {
                eventname: '无标题清单',
                event: []
            };
            this.events.push(mevent);
            this.groupIndex = 2;
            this.eventIndex = this.events.length - 1;
        },
        EditTitle: function(state) { //编辑清单标题
            if (this.groupIndex <= 1)
                return;
            this.isTitleEdit = state;
            if (state) {
                if (this.tempEventName !== '')
                    this.events[this.eventIndex].eventname = this.tempEventName;
            } else {
                setTimeout(this.EditTitleFocus, 100);
            }
        },
        EditTitleFocus: function() { //编辑标题文字获取焦点
            var text = document.getElementById('titletext');
            if (text != null)
                text.focus();
        },
        AddEvent: function() { //创建代办事项
            if (this.aEvent.name === '')
                return;
            if (this.groupIndex === 0) {
                this.myDay.event.push(this.aEvent);
            } else if (this.groupIndex === 1) {
                this.toDo.event.push(this.aEvent);
            } else {
                this.events[this.eventIndex].event.push(this.aEvent);
            }
            this.aEvent = {
                name: '',
                done: false,
                time: '',
            };
        },
        DeleteEventList: function() { //删除清单
            if (this.groupIndex <= 1)
                return;
            if (this.eventIndex === this.events.length - 1) {
                this.eventIndex--;
                //this.events.splice(this.eventIndex + 1, 1); //删除清单
                this.events.pop();
            } else {
                this.events.splice(this.eventIndex, 1); //删除清单
            }
            if (this.events.length === 0)
                this.groupIndex = 1;
        },
        DeleteEvent: function(index) { //删除一个代办事项
            if (this.groupIndex === 2) {
                var ind = this.myDay.event.indexOf(this.events[this.eventIndex].event[index]);
                if (ind > -1) {
                    this.myDay.event.splice(ind, 1);
                } //删除myDay里面自定义清单的代办事项

                this.events[this.eventIndex].event.splice(index, 1);
            } else if (this.groupIndex === 1) {
                var ind = this.myDay.event.indexOf(this.toDo.event[index]);
                if (ind > -1) {
                    this.myDay.event.splice(ind, 1);
                } //删除myDay里面的toDo代办事项

                this.toDo.event.splice(index, 1);
            } else {
                this.myDay.event[index].from = '';
                this.myDay.event.splice(index, 1);
            }
        },
        DeleteFromMyDay: function(index) { //将添加到myDay清单的其他清单的代办事项从myDay中删除
            if (this.groupIndex === 2) {
                var ind = this.myDay.event.indexOf(this.events[this.eventIndex].event[index]);
                if (ind > -1) {
                    this.events[this.eventIndex].event[index].from = '';
                    this.myDay.event.splice(ind, 1);
                } //删除myDay里面自定义清单的代办事项
            } else if (this.groupIndex === 1) {
                var ind = this.myDay.event.indexOf(this.toDo.event[index]);
                if (ind > -1) {
                    this.toDo.event[index].from = '';
                    this.myDay.event.splice(ind, 1);
                } //删除myDay里面的toDo代办事项
            }
        },
        SearchEvent(state) { //搜索代办事项
            this.issearch = state;
            if (state)
                this.searchtext = '';
        },
        GetSearchEvent: function() { //获取搜索的代办事项
            var arr = new Array();
            if (this.searchtext == '')
                return arr;
            for (db in this.myDay.event) {
                if (this.myDay.event[db].name.search(this.searchtext) != -1) {
                    var marr = this.myDay.event[db];
                    if (marr.from != '' && marr.from != null)
                        continue;
                    marr.from = '我的一天';
                    arr.push(marr);
                }
            }
            for (db in this.toDo.event) {
                if (this.toDo.event[db].name.search(this.searchtext) != -1) {
                    var marr = this.toDo.event[db];
                    marr.from = 'To-Do';
                    arr.push(marr);
                }
            }
            for (db in this.events) {
                var events = this.events[db];
                for (data in events.event) {
                    if (events.event[data].name.search(this.searchtext) != -1) {
                        var marr = events.event[data];
                        marr.from = events.eventname;
                        arr.push(marr);
                    }
                }
            }
            return arr;
        },
        SetTempEdit: function(index, name, time) { //设置对话框里面的内容
            this.tempEditEventIndex = index;
            this.tempEditEventName = name;
            if (time)
                this.tempEditEventTime = time;
            else
                this.tempEditEventTime = '';
            if (this.groupIndex === 2) {
                var temp = this.events[this.eventIndex].event[index].from;
                if (temp == '' || temp == null)
                    this.tempAddToMyDayBtn = '添加到“我的一天”';
                else
                    this.tempAddToMyDayBtn = '从“我的一天”中删除';
            } else if (this.groupIndex === 1) {
                var temp = this.toDo.event[index].from;
                if (temp == '' || temp == null)
                    this.tempAddToMyDayBtn = '添加到“我的一天”';
                else
                    this.tempAddToMyDayBtn = '从“我的一天”中删除';
            }
        },
        Sort: function() { //排序，如果有多种排序，根据排序类别排序
            if (this.groupIndex === 2) {
                this.SortByTime(this.events[this.eventIndex].event);
            } else if (this.groupIndex === 1) {
                this.SortByTime(this.toDo.event);
            } else {
                this.SortByTime(this.myDay.event);
            }
        },
        GetToday: function() { //获取今天，00:00:00
            var now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            return now;
        },
        CompareTime: function(time1, time2) { //比较两个时间大小，小则返回true，大则返回false
            if (new Date(time1) < new Date(time2))
                return true;
            return false;
        },
        SortByTime: function(event) { //按照截止日期大小排序当前清单
            if (event.length <= 0)
                return;
            var temp = [];
            var n = event.length;
            var cmp = this.CompareTime;
            for (var i = 0; i < n - 1; i++) {
                if (event[i].time === '' || event[i].time === null) { //将没有时间的取出
                    temp.push(event.splice(i, 1)[0]);
                    i--;
                    n--;
                    continue;
                }
                for (var j = i + 1; j < n; j++)
                    if (cmp(event[j].time, event[i].time)) {
                        event[j] = event.splice(i, 1, event[j])[0];
                    }
            }
            event.push.apply(event, temp); //将没有时间的添加到最后
        },
        Finish: function(index) { //完成或取消完成代办事项
            if (this.groupIndex === 2) {
                var state = this.events[this.eventIndex].event[index].done;
                this.events[this.eventIndex].event[index].done = !state;
            } else if (this.groupIndex === 1) {
                var state = this.toDo.event[index].done;
                this.toDo.event[index].done = !state;
            } else {
                var state = this.myDay.event[index].done;
                this.myDay.event[index].done = !state;
            }
        },
        HideDone: function() { //隐藏已完成代办事项
            this.hidedone = !this.hidedone;
        },
        HideDoneBtnName: function() { //改变隐藏已完成代办事项按钮名称
            if (this.hidedone)
                return '显示已完成';
            return '隐藏已完成';
        },
        GetNoDoneCount: function(event) { //获取没有做的个数
            var count = 0;
            for (var i = 0; i < event.event.length; i++) {
                if (!event.event[i].done)
                    count++;
            }
            return count;
        },
        ChangeEvent: function() {
            //更改名称和截至日期
            if (this.groupIndex === 2) {
                if (this.tempEditEventName !== '')
                    this.events[this.eventIndex].event[this.tempEditEventIndex].name = this.tempEditEventName;
                this.events[this.eventIndex].event[this.tempEditEventIndex].time = this.tempEditEventTime;
            } else if (this.groupIndex === 1) {
                if (this.tempEditEventName !== '')
                    this.toDo.event[this.tempEditEventIndex].name = this.tempEditEventName;
                this.toDo.event[this.tempEditEventIndex].time = this.tempEditEventTime;
            } else {
                if (this.tempEditEventName !== '')
                    this.myDay.event[this.tempEditEventIndex].name = this.tempEditEventName;
                this.myDay.event[this.tempEditEventIndex].time = this.tempEditEventTime;
            }
        },
        ChangeTheme: function(index) { //切换主题
            var menu = document.getElementById('evemenu'); //获取整体背景
            menu.style.backgroundColor = this.themes[index].style.evemenu;
            var title = document.getElementById('evetitle'); //获取文字颜色
            title.style.color = this.themes[index].style.evetitle;
            var body = document.body; //获取总页面
            body.style.backgroundImage = 'url(' + this.themes[index].style.back + ')';
        },
        AddToMyDay: function(index) { //将代办事项添加到我的一天
            if (this.groupIndex === 2) {
                var temp = this.events[this.eventIndex].event[index];
                if (temp.from != '' && temp.from != null) {
                    this.events[this.eventIndex].event[index].from = '';
                    this.DeleteFromMyDay(index);
                    this.tempAddToMyDayBtn = '添加到“我的一天”';
                    return;
                }
                temp.from = this.events[this.eventIndex].eventname;
                this.myDay.event.push(temp);
                this.tempAddToMyDayBtn = '从“我的一天”中删除';
            } else if (this.groupIndex === 1) {
                var temp = this.toDo.event[index];
                if (temp.from != '' && temp.from != null) {
                    this.DeleteFromMyDay(index);
                    this.tempAddToMyDayBtn = '添加到“我的一天”';
                    return;
                }
                temp.from = this.toDo.eventname;
                this.myDay.event.push(temp);
                this.tempAddToMyDayBtn = '从“我的一天”中删除';
            }
        },
        GetToMyDay: function() { //打开时将需要添加到myDay的内容添加进去
            for (db in this.events) {
                var data = this.events[db].event;
                for (info in data) {
                    if (data[info].from != '' && data[info].from != null)
                        this.myDay.event.push(data[info]);
                }
            }
            var data = this.toDo.event;
            for (db in data) {
                if (data[db].from != '' && data[db].from != null)
                    this.myDay.event.push(data[db]);
            }
        },
        SaveData: function() { //保存信息
            var myday = {
                eventname: '我的一天',
                event: []
            }
            for (var db in this.myDay.event) {
                if (this.myDay.event[db].from == '' || this.myDay.event[db].from == null)
                    myday.event.push(this.myDay.event[db])
            }
            var myDay = JSON.stringify(myday);
            var toDo = JSON.stringify(this.toDo);
            var events = JSON.stringify(this.events);
            var mdata = {
                myday: myDay,
                todo: toDo,
                events: events
            };
            // console.log(this.events)
            $.ajax({
                url: '/save',
                type: "POST",
                dataType: "jsonp",
                data: mdata,
                success: function(mdata) {},
            });
        },
        ChangeData: function(myday, todo, events) { //替换现在的数据
            this.myDay = myday;
            this.toDo = todo;
            this.events = events;
        },
        ChangeID: function(user) { //传入用户信息
            this.userId = user;
        },
        Loaded: function() {
            this.isLoaded = true;
        },
        GetData: function() { //获取信息，页面载入时执行
            var change = this.ChangeData;
            var changeID = this.ChangeID;
            var Loaded = this.Loaded;
            var GetToMyDay = this.GetToMyDay;
            $.get('/userinfo', function(data) {
                if (data.isdata) {
                    var myday = JSON.parse(data["myday"]);
                    var todo = JSON.parse(data["todo"]);
                    var events = JSON.parse(data["events"]);
                    change(myday, todo, events);
                    changeID(data.user);
                } else {
                    changeID(data.user);
                }
                Loaded();
                GetToMyDay(); //将添加入myDay的代办事项添加到myDay中
            });
        },
    },
    watch: {
        todo: {
            handler() {
                if (this.isLoaded)
                    this.SaveData();
            },
            deep: true
        },
        myDay: {
            handler() {
                if (this.isLoaded)
                    this.SaveData();
            },
            deep: true
        },
        events: {
            handler() {
                if (this.isLoaded)
                    this.SaveData();
            },
            deep: true
        }
    },
    mounted: function() {
        this.GetData(); //从服务器中获取数据
    }
});