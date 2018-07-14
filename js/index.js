$(function () {
    var count = 0; //公告数量
    var next = 0; //下一次要显示的item
    var port = location.port;
    var hostname = location.hostname;
    var bureau = {
        HTMLDecode: function (text) {
            var temp = document.createElement("div");
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
        },
        showDate: function () {
            var mydate = new Date();
            var str = mydate.getFullYear() + ' 年 ';
            str += (mydate.getMonth() + 1) + ' 月 ';
            str += mydate.getDate() + ' 日 ';
            $(".showdate").html(' （' + str + '） ');
        },
        splicName: function (names) {
            nameSp = names.split("")
            if (nameSp.length == 2) {
                $(".nbsps").css({ padding: "0 30px" })
                return nameSp[0] + "<span class='nbsps'></span>" + nameSp[1]
            } else {
                return names
            }
        },
        Trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        sort:function(arr){
            for(var i=0;i<arr.length-1;i++){
                for(var j=0;j<arr.length-i-1;j++){
                    if(arr[j].orderid>arr[j+1].orderid){
                        var hand = arr[j];
                        arr[j]=arr[j+1];
                        arr[j+1]=hand;
                    }
                }
            }
            return arr;
        }
    }

    bureau.showDate()

    $.ajax({
        url: 'http://' + hostname + ':' + port + '/Station/notice.do?method=queryAllUser&jsonpCallback=result',
        // url:"http://192.168.200.9:3969/Station/notice.do?method=queryAllUser&jsonpCallback=result",
        type: "get",
        dataType: "json",
        success: function (data) {
            console.log(data)
            if (bureau.Trim(data.leader[0].dutyname) == "带班领导") {
                $("#leader").html(bureau.splicName(data.leader[0].username))
            }
            for (var i = 0; i < data.qxt.length; i++) {
                if (bureau.Trim(data.qxt[i].department) == "气象台") {
                    console.log(typeof (bureau.splicName(data.qxt[i].username)))
                    if (bureau.Trim(data.qxt[i].dutyname) == "领班") {
                        $("#ling").html('<span class="name">' + bureau.splicName(data.qxt[i].username) + '</span><span class="san">（领<span style="padding:0 30px;"></span>班）</span>')
                    }
                    if (bureau.Trim(data.qxt[i].dutyname) == "主班") {
                        $("#zhu").html('<span class="name">' + bureau.splicName(data.qxt[i].username) + '</span><span class="san">（主<span style="padding:0 30px;"></span>班）</span>')
                    }
                    if (bureau.Trim(data.qxt[i].dutyname) == "综合班") {
                        $("#zong").html('<span class="name">' + bureau.splicName(data.qxt[i].username) + '</span><span class="san">（综合班）</span>')
                    }
                }
            }

            if (bureau.Trim(data.webcenter[0].dutyname) == "网络中心") {
                $("#wlzx").html(bureau.splicName(data.webcenter[0].username))
            }

            var elsehtml = "";
            if (data.elses) {
                for (var i = 0; i < data.elses.length; i++) {
                    elsehtml += '<p>' +
                        '<span class="name">' + bureau.splicName(data.elses[i].username) + '</span>' +
                        '<span class="wu">（' + bureau.splicName(data.elses[i].dutyname) + '）</span>' +
                        '</p>'
                }
            }
            $("#elses").html(elsehtml)
        },
        error: function () {
            $("#leader").html("")
            $("#ling").html("")
            $("#zhu").html("")
            $("#zong").html("")
            $("#wlzx").html("")
            $("#elses").html("")
        }
    });

    $.ajax({
        type: "get",
        dataType: "json",
        url: 'http://' + hostname + ':' + port + '/Station/notice.do?method=queryAllNotice2',
        success: function (data) {
			console.log(data)
            bureau.sort(data)
            console.log(data)
            count = data.length + 1
            var num=0;
            for (var i = 0; i < data.length; i++) {
                num++
                var b = new Base64();
                var jsondata = bureau.HTMLDecode(data[i].ncontent)
                jsondata = b.decode(jsondata)
                var divhtml = '<div class="item">' +
                    '<div class="Wrap WrapTwo">' +
                    '<div class="section sectionTwo">' +
                    '<div class="announcement announcement'+num+'" id="announcement">' + jsondata +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $(".wrap").append(divhtml)
            }
        },
        error: function () {
            console.log("err")
        }
    });
    setInterval(function () {
        next++
        next = next % count
        $(".wrap .item").css("display", "none")
        $(".wrap").find(".item").eq(next).css("display", "block")
    }, 15000)
})