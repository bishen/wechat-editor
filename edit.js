/**
 * created by bishen.org 2017/05/18
 * 毕绅原创   微信weui内容编辑器
 * https://github.com/bishen/wechat-editor
 */
var weEdit = {
    id: '',
    width: '574px',
    height: '600px',
    frm: {},
    doc: {},
    color: {},
    command: '',
    code: false,
    textarea: {},
    files: 0,
    xhr: new XMLHttpRequest(),
    buttons: [
        'undo', 'h2', 'h3', 'p', 'img', 'vod', 'b', 'i', 'u', 's', 'l', 'c', 'r', 'h', 'color', 'bgcolor', 'code'
    ],
    func: {
        'undo': {
            'icon': 'icon-undo-2',
            'title': '撤消重做',
            'method': function() {
                weEdit.exec('undo');
            }
        },
        'h2': {
            'icon': 'icon-pilcrow',
            'title': '章标题',
            'method': function() {
                weEdit.exec('formatBlock', 'H2');
            }
        },
        'h3': {
            'icon': 'icon-right-to-left',
            'title': '节标题',
            'method': function() {
                weEdit.exec('formatBlock', 'H3');
            }
        },
        'p': {
            'icon': 'icon-paypal-2',
            'title': '文字段落',
            'method': function() {
                weEdit.exec('formatBlock', 'P');
            }
        },
        'img': {
            'icon': 'icon-picture',
            'title': '插入图片',
            'method': function() {
                var fl = document.createElement('input');
                fl.type = 'file';
                fl.click();
                fl.onchange = function() {
                    var fd = new FormData();
                    fd.append("file", this.files[0]);
                    if (this.files[0].type.indexOf("image") == -1) {
                        alert('只能上传jpg/png/gif');
                    } else {
                        if (this.files[0].size > 2048000) {
                            alert('微信限制上传图片不能超过2M');
                        } else {
                            weEdit.files++;
                            weEdit.exec('insertHTML', '<img src="/images/loading.gif" id="file' + weEdit.files + '">');
                            weEdit.upImage(weEdit.files, fd, this.files[0].size);
                        }
                    }
                }
            }
        },
        'vod': {
            'icon': 'icon-play',
            'title': '插入视频',
            'method': function() {
                // 功能如同力片
                alert('还未开发此功能');
            }
        },
        'b': {
            'icon': 'icon-bold',
            'title': '加粗',
            'method': function(e) {
                weEdit.exec('bold');
            }
        },
        'i': {
            'icon': 'icon-italic',
            'title': '倾斜',
            'method': function() {
                weEdit.exec('italic');
            }
        },
        'u': {
            'icon': 'icon-underline',
            'title': '下划线',
            'method': function() {
                weEdit.exec('underline');
            }
        },
        's': {
            'icon': 'icon-strikethrough',
            'title': '删除线',
            'method': function() {
                weEdit.exec('strikeThrough');
            }
        },
        'l': {
            'icon': 'icon-paragraph-left-2',
            'title': '左对齐',
            'method': function() {
                weEdit.exec('justifyLeft');
            }
        },
        'c': {
            'icon': 'icon-paragraph-center-2',
            'title': '居中对齐',
            'method': function() {
                weEdit.exec('justifyCenter');
            }
        },
        'r': {
            'icon': 'icon-paragraph-right-2',
            'title': '右对齐',
            'method': function() {
                weEdit.exec('justifyRight');
            }
        },
        'h': {
            'icon': 'icon-minus-4',
            'title': '插入水平线',
            'method': function() {
                weEdit.exec('insertHorizontalRule');
            }
        },
        'color': {
            'icon': 'icon-chart-3',
            'title': '字体颜色',
            'method': function() {
                weEdit.command = 'foreColor';
                weEdit.color.click();
            }
        },
        'bgcolor': {
            'icon': 'icon-chart-alt',
            'title': '背景颜色',
            'method': function() {
                weEdit.command = 'hiliteColor';
                weEdit.color.click();
            }
        },
        'code': {
            'icon': 'icon-code-2',
            'title': '源码',
            'method': function() {
                if (weEdit.code) {
                    weEdit.textarea.style.display = 'none';
                    weEdit.doc.body.innerHTML = weEdit.textarea.value;
                } else {
                    weEdit.textarea.style.display = '';
                }
                weEdit.code = !weEdit.code;
            }
        }
    },
    exec: function(aCommandName, aValueArgument) {
        if (aValueArgument)
            weEdit.doc.execCommand(aCommandName, false, aValueArgument);
        else
            weEdit.doc.execCommand(aCommandName, false);
        weEdit.setDate();
    },
    setDate: function() {
        weEdit.textarea.value = weEdit.doc.body.innerHTML;
    },
    init: function() {
        this.id = document.querySelector(this.id);
        if (this.id) {
            var style = document.createElement('style');
            var tools = document.createElement('div');
            tools.className = 'weButtons';
            style.type = 'text/css';
            style.innerHTML = '.weButtons{padding:0;font-size:16px}';
            style.innerHTML += '.weButtons i{margin:0 6px 4px 0;padding:5px;border-radius:4px;display:inline-block;border:1px solid #ccc}';
            style.innerHTML += ".weButtons i:hover{background-color:#03C;cursor:pointer;color:#fff}";
            this.color = document.createElement('input');
            this.color.type = 'color';
            this.color.onchange = function() {
                weEdit.exec(weEdit.command, this.value);
            };
            this.textarea = document.createElement('textarea');
            this.textarea.style.cssText = "display:none;position:absolute;z-index:2;border:1px solid #ccc;padding:10px;width:" + this.width + ";height:" + this.height;
            this.frm = document.createElement('iframe');
            this.frm.style.cssText = "width:" + this.width + ";height:" + this.height + ";border:2px solid #ccc";
            this.id.appendChild(style);
            this.id.appendChild(tools);
            this.id.appendChild(this.textarea);
            this.id.appendChild(this.frm);
            this.doc = this.frm.contentWindow.document;
            this.doc.designMode = "on";
            this.doc.write('<head><style type="text/css">html { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}');
            this.doc.write('body { line-height: 1.6; font-family: -apple-system-font, "Helvetica Neue", sans-serif;}');
            this.doc.write('* { margin: 0; padding: 0;}::selection{background-color:#FF0080;color:#fff}');
            this.doc.write('.weui-article {padding: 20px 15px;font-size:14px;}');
            this.doc.write('.weui-article section {margin-bottom: 1.5em;}');
            this.doc.write('.weui-article h1 {font-size: 18px;font-weight: 400;margin-bottom: .9em;}');
            this.doc.write('.weui-article h2 {font-size: 16px;font-weight: 400;margin-bottom: .34em;}');
            this.doc.write('.weui-article h3 {font-weight: 400;font-size: 15px;margin-bottom: .34em;}');
            this.doc.write('.weui-article * {max-width: 100%;box-sizing: border-box;word-wrap: break-word;}');
            this.doc.write('.weui-article p {margin: 0 0 .8em;}table{width:100%}td,th{border:1px solid #CCC}');
            this.doc.write('</style></head > ');
            this.doc.close();
            this.doc.body.className = 'weui-article';
            this.doc.body.focus();
            this.doc.body.onkeyup = function(e) {
                if (e.keyCode == 13) {
                    this.innerHTML = this.innerHTML.replace(/<div>/ig, '<p>').replace(/<\/div>/ig, '</p>');
                    var range = weEdit.doc.getSelection(); //创建range
                    range.selectAllChildren(weEdit.doc.body); //range 选择obj下所有子内容
                    range.collapseToEnd(); //光标移至最后
                };
                weEdit.setDate();
            };
            weEdit.doc.addEventListener('paste', function(e) {
                var html = e.clipboardData.getData('text/html');
                e.preventDefault();
                var start = html.indexOf('<!--StartFragment-->');
                start = start == -1 ? 0 : start + 20;
                html = html.substring(start, html.lastIndexOf('<!--EndFragment-->'));
                html = html.replace(/<img[^>]*?(src="[^"]*?")[^>]*?>/ig, '<\\--img $1 />'); // 微信里是不可以包含外部图片地址的
                html = html.replace(/<(\w+)[^>]*>/ig, '<$1>').replace(/<\\--img/g, '<img');
                html = html.replace(/<div>/ig, '<p>').replace(/<code>/ig, '<p>');
                html = html.replace(/<\/div>/ig, '</p>').replace(/<\/code>/ig, '</p>');
                html = html.replace(/<span>/ig, '').replace(/<\/span>/ig, '');
                html = html.replace(/<p><\/p>/ig, '').replace(/(<p>){2,}/ig, '<p>').replace(/(<\/p>){2,}/ig, '</p>');
                weEdit.exec('insertHtml', html);
            });
            for (var i = 0; i < this.buttons.length; i++) {
                if (this.func[this.buttons[i]]) {
                    var obj = this.func[this.buttons[i]];
                    var but = document.createElement('i');
                    but.className = obj.icon;
                    but.title = obj.title;
                    but.onclick = obj.method;
                    tools.appendChild(but);
                }
            }
        }
    },
    loadScript: function(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    upImage: function(fs, fd, sz) {
        weEdit.xhr.upload.addEventListener("progress", function(evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                console.log(percentComplete.toString() + '%');
            }
        }, false);
        weEdit.xhr.addEventListener("load", function(evt) {
            var str = evt.target.responseText;
            if (str == 'no') {
                alert('上传失败！');
            } else {
                // 发送至微信，添加永久素材
                weEdit.loadScript('/json/wechat/add_material?f=' + fs + '&tp=image&sz=' + sz + '&fn=success&url=' + str);
            }
        }, false);
        weEdit.xhr.addEventListener("error", function() {
            alert('上传失败！');
        }, false);
        weEdit.xhr.open("POST", "/manager/upfile");
        weEdit.xhr.send(fd);
    }
};

var we = weEdit;
we.id = '#edit';
we.init();

// 上传成功回调，请将当前网站域名添加至微信后台的授权域名里，否则无法显示出图片
function success(fs, url) {
    if (url == '') {
        alert('上传失败！');
        we.exec('undo');
    } else {
        we.doc.getElementById('file' + fs).src = url;
        we.setDate();
    }
}