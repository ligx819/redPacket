var Modal = {
	size: 'normal', //尺寸 normal 正常 large 大尺寸 small 小尺寸 
	title: '提示',
	btn_cancel_title: '', //取消
	btn_save_title: '保存',
	btn_close_title: '关闭',
	url:'',

	init: function(option){        
		if(option != undefined){
			$.each(option,function(n,m){
				Modal[n] = m;
			});
		}
        var modal_wrapper = $('<div>').addClass('modal fade');
        var modal_dialog  = $('<div>').addClass('modal-dialog');
        var modal_content = $('<div>').addClass('modal-content');
        var modal_form    = $('<form>').attr({name:'modal_form', id:'modal_form', action:Modal.url, method:'post'});

		var classname = '';
    	if(Modal.size == 'large'){
    		classname = 'modal-lg';
    	}else if(Modal.size == 'small'){
    		classname = 'modal-sm';
    	}
        modal_dialog.addClass(classname);

    	var id = '';
    	if(Modal.id != undefined){
    		id = 'id="' + Modal.id + '"';
            modal_wrapper.attr('id', Modal.id);
    	}
        if (Modal.backdrop != undefined) {
            modal_wrapper.attr('data-backdrop', Modal.backdrop);
        }
        if (Modal.keyboard != undefined) {
            modal_wrapper.attr('data-keyboard', Modal.keyboard);
        }
        modal_dialog.appendTo(modal_wrapper);
        modal_content.appendTo(modal_dialog);

        if (Modal.noheader == undefined) {
            modal_form.append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+Modal.title+'</h4></div>');
        }

        modal_form.append('<div class="modal-body">'+Modal.content+'</div>');
    	
        if (Modal.nofooter == undefined) {
            modal_form.append('<div class="modal-footer"><button type="button" class="btn btn-default btn_cancel" data-dismiss="modal">'+Modal.btn_cancel_title+'</button><button type="button" class="btn btn-primary btn_close" data-dismiss="modal">'+Modal.btn_close_title+'</button><button type="submit" class="btn btn-primary btn_save">'+Modal.btn_save_title+'</button></div>');
        }
        modal_form.appendTo(modal_content);

        // var html = '<div '+id+' class="modal fade bs-example-'+classname+'"><div class="modal-dialog '+classname+'"><div class="modal-content"><form name="modal_form" id="modal_form" action="'+Modal.url+'" method="post"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+Modal.title+'</h4></div><div class="modal-body">'+Modal.content+'</div><div class="modal-footer"><button type="button" class="btn btn-default btn_close" data-dismiss="modal">'+Modal.btn_close_title+'</button><button type="submit" class="btn btn-primary btn_save">'+Modal.btn_save_title+'</button></div></form></div></div></div>';
        var html = modal_wrapper;

        if($('.modal').length > 0){
        	$('.modal').remove();
        }
    	$('body').append(html);
        
    	if(Modal.btn_cancel_title == ''){
    		$('.modal .btn_cancel').hide();
    	}
        $('.modal .btn_save').hide();
        if(option != undefined){
	        if((option.url != undefined && option.url != null) || (option.btn_save_title != undefined && option.btn_save_title != null)){
	        	$('.modal .btn_save').show();
	        }
        }
        
        //侦听弹窗事件
        $('.modal').on('show.bs.modal', function (e) {
        	//show 方法调用之后立即触发该事件
        	

        })
        $('.modal').on('shown.bs.modal', function (e) {
        	//此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发

        })
        $('.modal').on('hidd.bs.modal', function (e) {
        	//hide 方法调用之后立即触发该事件

        })
        $('.modal').on('hidden.bs.modal', function (e) {
        	//此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发

        })
        $('.modal').on('loaded.bs.modal', function (e) {
        	//从远端的数据源加载完数据之后触发该事件

        })
		
	},
	modal: function(option,callback){
		Modal.init(option);
		if($('.modal-backdrop').length > 0) $('.modal-backdrop').remove();
		$('.modal').modal();
		if($.isFunction(callback))
		{
			callback.apply(null);
		}
	},
	show: function(content,callback){
		if($('.modal').length == 0){
			Modal.modal({
				'content' : content
			});
			$('.modal .btn_save').hide();
		}else{
			$('.modal').modal();
			$('.modal').find('.btn_save').hide();
			$('.modal').find('.modal-body').html(content);
			$('.modal').find('button').html(function(){
				return $(this).text();
			});
			$('.modal').find('button').removeAttr('disabled');
		}
		
		if($.isFunction(callback))
		{
			$('.modal').on('hidden.bs.modal', function () {
				callback.apply(null);
			});
		}else{
			if(callback == 'refresh'){
				$('.modal').on('hidden.bs.modal', function () {
					window.location.reload();
			    });				
			}
		}
	},
	onhidden: function(callback){
		if($.isFunction(callback))
		{
			$('.modal').on('hidden.bs.modal', function () {
				callback.apply(null);
			});
		}
	},
	set: function(json){
		$.each(json,function(n,m){
			if(n == 'form'){
				$.each(m,function(x,y){
					$('.modal').find('form').attr(x, y);
					if(x == 'action'){
						$('.modal').find('.btn_save').show();
					}
				});
			}else{
				$('.modal').attr(n, m);
			}
		});
	},
	confirm : function(content,func,tips,buttons){
		var ok = '', cancel = '';
		if(buttons !== undefined && $.isArray(buttons))
		{
			ok 		= buttons[0];
			cancel 	= buttons[1];
		}
		else
		{
			ok 		= '确认';
			cancel 	= '取消';				
		}
		var option = {
				'id' : '',
				'title' : '温馨提示',
				'content' : content,
				'btn_cancel_title' : cancel,
				'btn_close_title': ok,
			}
		Modal.modal(option);
		$('.modal .btn_close').off();
		$('.modal .btn_close').on('click',function(){				
			var that = $(this);
			Modal.add_loading(tips);
			if($.isFunction(func))
			{					
				func.apply(that);
				return;
			}
			else{
				$('.modal').hide();
			}				
		});		
	},
    
	add_loading: function(content){
		if(content == 'close'){
		    $('.tip_zz').html('').hide();
		    return;	
		}
		if(content == undefined) content = '加载中......请稍侯！';
		if($('.tip_zz').length == 0){
			$('body').prepend('<style>.tip_zz{position:absolute;z-index:9999;left:0px;right:0px;top:0px;bottom:0px;background:rgba(0,0,0,0.6);display: box;display: -webkit-box;display: -moz-box;-webkit-box-pack:center;-moz-box-pack:center;-webkit-box-align:center;-moz-box-align:center;}.tip_zz span{display:inline-block;padding:15px;background:rgba(0,0,0,0.3);color:#fff;font-size:17.5px;border-radius:4px;}</style><div class="tip_zz"><span><i class="fa fa-refresh fa-spin"></i> '+content+'</span></div>');
			$('.tip_zz').height($(document).height());
		}else{
			$('.tip_zz').html('<span><i class="fa fa-refresh fa-spin"></i> '+content+'</span>').show();
		}
	},
	ajax: function(option, callback){
        var type = option.type?option.type:'POST';
        var post_data = option.data ? option.data : {};
        if(type == "POST"){
            post_data[csrf_token_name] = csrf_token_value;
        }
		$.ajax({
			url			: option.url,
			type		: type,
			data		: post_data,
			dataType	: option.dataType?option.dataType:"json",
			cache		: false,
			beforeSend	: function(){
				var e = option.e;
				if(e != undefined && e != null){
					Modal.btn = e.target;
					var text = $(Modal.btn).text();
					$(Modal.btn).html('<i class="fa fa-refresh fa-spin"></i> ' + text);	
					$(Modal.btn).attr("disabled","disabled");
				}else{
					Modal.add_loading(option.tips);
				}
			},
			success: function(result){
				if(option.remove_load == undefined || option.remove_load == true){
					if($('.tip_zz').length > 0)	$('.tip_zz').remove();
				}
				if(result){
					if(callback && (callback  instanceof Function)){
						return callback(result);
					}
				}else{
					return false;
				}
			}

		},'json')
		
	},
	remove: function(){
		if($('.modal').length > 0){
			$('.modal').remove();
			$('.modal-backdrop').remove();
		}
	},
    hide: function(callback){
        $('.modal').modal('hide');
        Modal.onhidden(callback);
    }
}
/*
var option = {
	"content": "dslkjfljsld",
	"url": "<?php echo site_url($controller.'/test');?>",
} 
Modal.init(option);*/