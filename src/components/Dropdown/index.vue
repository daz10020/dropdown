<template>
		<div class="dropdown-wrapper" :style="inputStyleObj">
				<div class="dropdown-input"  @click="cliInput" ref="input">
						<div class="dropdown-tags" v-if="multiple">
							<span class="dropdown-tag" :style="{lineHeight:multiHeight}" v-for="s in selections">
								<span>{{s[textField]}}</span>
								<span class="dropdown-tag-cls" @click.stop="unSelectRow(s,s.index)">&times;</span>
							</span>
						</div>
						<input type="text" class="dropdown-input-inner"
							:placeholder=placeholder_
							:readonly=readOnly
							:class="{'is-focus' : isFocus,'is-readonly':readOnly}"
							:value="search"
							@input="formatValue($event.target.value)">
						<div class="dropdown-icon"
							:class="{'is-reverse' : isFocus}"
							:style="{lineHeight:inputStyleObj.height}">&gt;</div>
				</div>
				<div class="dropdown-down" :style="listStyleObj" v-show="isFocus">
						<div class="dropdown-list-wrapper"
							  ref="listWrapper"
							  :class="{'is-move':isMove}"
                :style="{maxHeight:panelMaxHeight}"
							  @mousewheel="scroll">
								<ul class="dropdown-list" ref="listCon">
									<ul class="dropdown-group" v-for="(g,i) in filteredData">
											<li class="dropdown-label"
												v-if="g.label !== undefined"
												:style="itemStyleObj">{{g.label}}</li>
											<li class="dropdown-item"
												v-for="(item,ii) in g.filtList"
												:key="item[idField]"
												:style="itemStyleObj"
												:class="[{'is-selected':selections.indexOf(item) !== -1},wrap]"
												@click="selectRow(item,ii)"
											>{{item[textField]}}</li>
									</ul>
								</ul>
								<div class="dropdown-scrollbar is-horizontal">
                  <div class="dropdown-thumb"
                       ref="hScorllbar"
                       :style="{width:hScrWidth}"
                       @mousedown="hDrag" ></div>
								</div>
								<div class="dropdown-scrollbar is-vertical">
									<div class="dropdown-thumb"
                       @mousedown="vDrag"
                       :style="{height:vScrHeight}"
                       ref="vScorllbar"></div>
								</div>

						</div>
						<div class="dropdown-arrow" :class="{'is-top':isTop}"></div>
				</div>
		</div>
</template>
<script>
		//  临界值
		function scope (q,min,max) {
				if (q < min) {
					q = min;
				} else if (q > max) {
					q = max;
				}
				return q;
		}
		//  格式化像素
		function formatPX (px) {
			px = window.parseInt(px);
			if(window.isNaN(px)) {
				px = 0;
			}
			return px;
		}

		// 定位
		function positions(vm,sdom) {
			let inputDomPosition = sdom.getBoundingClientRect();
			let it = inputDomPosition.top,
          il = inputDomPosition.left,
          ib = inputDomPosition.bottom;
      if (document.documentElement.clientHeight - ib < vm.listWrap.ww && it >= vm.listWrap.ww) {
        vm.isTop = true;
        vm.listLeft = il + 'px';
        vm.listTop = it - vm.listWrap.wh - 10 + 'px';
        return;
      }
      vm.listLeft = il + 'px';
      vm.listTop = ib + 'px';
      vm.isTop = false;
    }
		export default {

				props : {
					// 只读状态
					readOnly: {
						type :Boolean,
						default : false,
					},
					// 下拉菜单value
					idField: {
						type :String,
						default : 'id',
					},
					// 下拉菜单文本
					textField: {
						type :String,
						default : 'text',
					},
					// 空白填充
					placeholder: {
						type :String,
						default : '请选择',
					},
					// 多选
					multiple: {
						type :Boolean,
						default : false,
					},
					// 文本框宽度
					textWidth: {
						type :String,
						default : '240px',
					},
					// 文本框高度
					textHeight: {
						type :String,
						default : '40px',
					},
					// 菜单宽度
					panelWidth: {
						type :String,
						default : '240px',
					},
					// 菜单高度
					panelHeight: {
						type :String,
						default : '260px',
					},
					// 菜单最大高度
					panelMaxHeight: {
						type :String,
						default : '240px',
					},
					// 选项行高
					itemHeight: {
						type :String,
						default : '40px',
					},
					// 文本折行
					wrap: {
						type :String,
						default : 'wb',
					},
          //  菜单内容
					data: {
						type : Array,
						default : () => []
					},
				},
				data () {
						return {
								inpTxt : '',  //  输入内容
								inpFlg : false, //  输入标记
								isMove: false, //  拖动状态
								isFocus:true, //  选中状态
								isTop: false, //  下拉框位置
                selections : [],  //  已选中选项
								listWrap : {},  //  菜单位置
								listTop : 0,  //  下拉菜单位置
								listLeft : 0, //  下拉菜单位置
						}
				},
				mounted () {
					//  菜单容器宽度、高度
					this.listWrap.ww = this.$refs.listWrapper.offsetWidth,
					this.listWrap.wh = this.$refs.listWrapper.offsetHeight,
					//  菜单内容宽度、高度
					this.listWrap.cw = this.$refs.listCon.offsetWidth,
					this.listWrap.ch = this.$refs.listCon.offsetHeight;
					this.isFocus = false;
					this.$nextTick(function () {
						// 移动菜单节点
						document.querySelector('body').appendChild(this.$el.childNodes[2]);
					});

					let vm = this;
					//  滚动条事件
					window.addEventListener('scroll',()=>positions(vm,vm.$el.childNodes[0]));
				},
				computed: {
						//  过滤数据
						filteredData () {
								let vm = this;
								//  过滤ID为空的选项
								return this.data.filter(item => {
										item.filtList = item.list.filter(opt => {
											//  根据输入筛选
											return opt[vm.idField] !== undefined && (vm.inpTxt === '' || opt[vm.textField].indexOf(self.inpTxt) !== -1 || vm.selections.length);
										});
										return item.filtList.length;
								});
						},
						//  选中选项高度
						multiHeight () {
							return formatPX(this.inputStyleObj.height) * 0.7 + 'px'
						},
						//  输入框样式
						inputStyleObj () {
							return {
								width:this.textWidth,
								height:this.textHeight,
							}
						},
						//  菜单部分样式
						listStyleObj () {
							return {
								width:this.panelWidth,
								height:this.panelHeight,
								maxHeight:this.panelMaxHeight,
								top:this.listTop,
								left:this.listLeft
							}
						},
						//  选项样式
						itemStyleObj () {
								return {
									lineHeight : formatPX(this.itemHeight) - 4 + 'px',
									height : this.itemHeight
								}
						},
						search () {
							let s = this.inpTxt;
							if (this.multiple) {
								s = '';
							} else if (s === '') {
								this.selections = [];
							} else if (!this.inpFlg && this.selections.length) {
								s = this.selections[0][this.textField];
							}
							this.inpTxt = s;
							this.inpFlg = false;
							return s;
						},
						placeholder_ () {
							return this.multiple && this.selections.length ? '' : this.placeholder;
						},
            hScrWidth () {
						  let wrap = this.$refs.listWrapper,res;
              if (this.listStyleObj.height !== undefined && wrap && this.isFocus !== 1 && this.filteredData) {
                setTimeout(() => {
                  if(wrap.offsetWidth) {
                    this.listWrap.ww = wrap.offsetWidth;
                    this.listWrap.cw = this.$refs.listCon.offsetWidth;
                  }
                  //  滚动条长度
                  if (this.listWrap.ww < this.listWrap.cw) {
                    res = (this.listWrap.ww / this.listWrap.cw * 100) + '%';
                  }
                  this.$refs.hScorllbar.style.width = res;
                });
              }
              return res;
            },
            vScrHeight () {
                let wrap = this.$refs.listWrapper,res;
                if (this.listStyleObj.height !== undefined && wrap && this.isFocus !== 1 && this.filteredData) {
                  setTimeout(() => {
                    if(wrap.offsetHeight) {
                      this.listWrap.wh = wrap.offsetHeight;
                      this.listWrap.ch = this.$refs.listCon.offsetHeight;
                    }
                    //  滚动条长度
                    if (this.listWrap.wh < this.listWrap.ch) {
                      res = (this.listWrap.wh / this.listWrap.ch * 100) + '%';
                    }
                    this.$refs.vScorllbar.style.height = res;
                  });
                }
                return res;
              },
				},
				methods: {
						formatValue (val) {
							this.inpFlg = true;
							this.inpTxt = val;
						},
						// 点击下拉菜单
						cliInput () {
							if (this.readOnly) {
								return;
							}
              this.isFocus = !this.isFocus;
              let vm = this;
							positions(vm,this.$el.childNodes[0]);
            },
						// 拖动水平滚动条
						hDrag (e) {
							let vm = this;
							let ref = this.$refs;
							//  滚动条最大移动距离
							let max = this.listWrap.ww - ref.hScorllbar.offsetWidth;
							//  菜单最大移动距离
							let maxList = this.listWrap.ww - this.listWrap.cw;
							//  移动比例系数
							let time = maxList / max;
							//  标记移动状态
							this.isMove = true;
							//  鼠标按下，计算鼠标与dom节点距离
							let dis = e.clientX - ref.hScorllbar.offsetLeft;
							//  记录起点
							let list = formatPX(ref.listCon.style.left);
							let q = formatPX(ref.hScorllbar.style.left);
							//  移动事件监听
							document.onmousemove = function (e) {

									//  通过事件委托，计算移动的距离
									let act = e.clientX - dis;
									let res = q + act;
									let listRes = list + act * time;
									//  判断是否在范围内
									res = scope(res,0,max);
									listRes = scope(listRes,maxList,0);

									//  更新位置参数
									ref.hScorllbar.style.left = res + 'px';
									ref.listCon.style.left = listRes + 'px';
							};
							//  停止移动，清理函数
							document.onmouseup = function (e) {
									this.isMove = false;
									document.onmousemove = null;
									document.onmouseup = null;
							 };
						},
						//  拖动垂直滚动条
						vDrag (e) {
							let vm = this;
							let ref = this.$refs;
							//  滚动条最大移动距离
							let max = this.listWrap.wh - ref.vScorllbar.offsetHeight - 5;
							//  菜单最大移动距离
							let maxList = this.listWrap.wh - this.listWrap.ch;
							//  移动比例系数
							let time = maxList / max;

							//  标记移动状态
							this.isMove = true;
							//鼠标按下，计算鼠标与dom节点距离
							let dis = e.clientY - ref.vScorllbar.offsetTop;
							//  记录起点
							let list = formatPX(ref.listCon.style.top);
							let q = formatPX(ref.vScorllbar.style.top);
							//  移动事件监听
							document.onmousemove = function (e) {

								//通过事件委托，计算移动的距离
									let act = e.clientY - dis;
									let res = q + act;
									let listRes = list + act * time;
									//  判断是否在范围内
									res = scope(res,0,max);
									listRes = scope(listRes,maxList,0);

									//  更新位置参数
									ref.vScorllbar.style.top = res + 'px';
									ref.listCon.style.top = listRes + 'px';
							};
							//  停止移动，清理函数
							document.onmouseup = function (e) {
									this.isMove = false;
									document.onmousemove = null;
									document.onmouseup = null;
							 };
						},
						// 滑动滚轮，同拖动垂直滚动条
						scroll (e) {
							let ref = this.$refs;
							//  滚动条最大移动距离
							let max = ref.listWrapper.offsetHeight - ref.vScorllbar.offsetHeight - 5;
							//  菜单最大移动距离
							let maxList = this.listWrap.wh - this.listWrap.ch;
							if(maxList > 0)
							  return;
							//  移动比例系数
							let time = maxList / max;
							//  记录起点
							let res = formatPX(ref.vScorllbar.style.top);
							let listRes = formatPX(ref.listCon.style.top);
							//  移动方向
							if (e.deltaY > 0) {
								res += 5;
								listRes += 5*time;
							} else {
								res -= 5;
								listRes -= 5*time;
							}

							//  判断是否在范围内
							res = scope(res,0,max);
							listRes = scope(listRes,maxList,0);

							//  停止移动，清理函数
							ref.vScorllbar.style.top = res + 'px';
							ref.listCon.style.top = listRes + 'px';
						},
						//  选中
						selectRow (row,index) {
							let id = row[this.idField],
									text = row[this.textField];
							row.index = index;
							//  单选时只做选中
							if (!this.multiple) {
								if(this.$emit('beforeSelectRow', row,index) === false)
									return;
								this.inpTxt = 's';
								this.selections = [row];
								this.isFocus = false;
								this.$emit('onSelectRow', row,index)
							} else if (this.selections.indexOf(row) !== -1) { //  已选中则取消选中
								this.unSelectRow(row,index);
							} else {  //  多选模式选中
								if(this.$emit('beforeSelectRow', row,index) === false)
									return;
								this.selections.push(row);
								this.$emit('onSelectRow', row,index)
							}
						},
						// 取消选中
						unSelectRow (row,index) {
							if(this.$emit('beforeUnselectRow', row,index) === false)
								return;
							//  从队列里清除选项
							this.selections.splice(this.selections.indexOf(row),1);
							this.$emit('onUnselectRow', row,index)
						},
				},

		}
</script>
<style lang="less" scoped>
		.wn { /* 强制不换行 */
				word-wrap:normal;
				white-space:nowrap;
		}
		.wb { /* 强制换行 */
				white-space:normal;
				word-wrap:break-word;
				word-break:break-all;
		}
		.dropdown-wrapper {
				position: relative;

				.dropdown-input {
						position: absolute;
						height: 100%;
						width: 100%;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
						background-color: #fafafc;
						text-align: center;
						border-radius: 3px;
						overflow: hidden;
						& * {
							height: 100%;
						}
						.dropdown-input-inner {
								-webkit-appearance: none;
								background-color: #fff;
								background-image: none;
								border-radius: 4px;
								border: 1px solid #dcdfe6;
								box-sizing: border-box;
								color: #606266;
								display: inline-block;
								font-size: inherit;
								outline: none;
								padding: 0 15px;
								transition: border-color .2s cubic-bezier(.645,.045,.355,1);
								width: 100%;
								line-height:100%;
								cursor: pointer;

								&.is-focus {
										border-color: #409eff;
								}
								&.is-readonly {
									background-color: #f5f7fa;
									border-color: #e4e7ed;
									color: #c0c4cc;
									cursor: not-allowed;
								}
						}
						.dropdown-tags {
							position: absolute;
							line-height: normal;
							white-space: normal;
							z-index: 1;
							top: 50%;
							transform: translateY(-50%);
							display: flex;
							align-items: center;
							flex-wrap: wrap;

							.dropdown-tag {
									box-sizing: border-box;
									border-color: transparent;
									height: 75%;
									padding: 0 8px;
									margin: 2px 0 2px 6px;
									background-color: #f0f2f5;
									color: #909399;
									border-radius:4px;

									.dropdown-tag-cls {
											border-radius:5px;
											width:10px;
											height:10px;
											line-height:12px;
											vertical-align: middle;
											display:inline-block;
											background-color: #c0c4cc;
											color: #fff;
									}
							}
						}

						.dropdown-icon {
								position: absolute;
								color: #c0c4cc;
								transition: all .3s;
								transform: rotate(90deg) scaleY(2);
								top:0;
								right:10%;

								&.is-reverse {
										transform: rotate(-90deg) scaleY(2);
								}
						}


				}
		}
		.dropdown-down {
			transform-origin: center top 0px;
			z-index: 2109;
			position: fixed;
			border: 1px solid #e4e7ed;
			border-radius: 4px;
			background-color: #fff;
			box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
			box-sizing: border-box;
			margin: 5px 0;

			.dropdown-list-wrapper {
				overflow:hidden;
				height:100%;

				&:hover .dropdown-scrollbar,&.is-move .dropdown-scrollbar {
					opacity:1;
				}

				.dropdown-list {
					padding: 6px 0;
					margin: 0;
					box-sizing: border-box;
					position:relative;

					& * {
						list-style: none;
					}

					.dropdown-group {
						position: relative;
						padding-bottom:24px;
						margin: 0;
						padding: 0;


						&:not(:last-of-type) {
							padding-bottom: 24px;
						}


						&:not(:last-of-type):after {
							content: "";
							position: absolute;
							display: block;
							left: 20px;
							right: 20px;
							bottom: 12px;
							height: 1px;
							background: #e4e7ed;
						}

						.dropdown-label {
							padding-left: 20px;
							font-size: 12px;
							color: #909399;
						}

						.dropdown-item {
							font-size: 14px;
							padding: 0 20px;
							position: relative;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: #606266;
							box-sizing: border-box;
							cursor: pointer;

							&:hover {
								background-color: #f5f7fa;
							}

							&.is-selected {
								color: #409eff;
								font-weight: 700;
							}
						}
					}
				}


				.dropdown-scrollbar {
					position: absolute;
					right: 2px;
					bottom: 2px;
					z-index: 1;
					border-radius: 4px;
					opacity: 0;
					transition: opacity .12s ease-out;


					&.is-horizontal {
						height: 6px;
						left: 2px;
						.dropdown-thumb {
							height:100%;
						}
					}

					&.is-vertical {
						width: 6px;
						top: 2px;
						.dropdown-thumb {
							width:100%;
						}
					}
				}

				.dropdown-thumb {
					position: relative;
					display: block;
					width: 0;
					height: 0;
					cursor: pointer;
					border-radius: inherit;
					background-color: hsla(220,4%,58%,.3);
					transition: background-color .3s;

					&:hover {
						background-color: hsla(220,4%,58%,.5);
					}
				}
			}


			.dropdown-arrow {
				position: absolute;
				display: block;
				width: 0;
				height: 0;
				border-width: 6px;
				border-style: solid;
				border-color: transparent;

				top: -6px;
				left: 25%;
				margin-right: 3px;
				border-top-width: 0;
				border-bottom-color: #fff;

				&.is-top {
					bottom: -6px;
          top:auto;
					border-top-color: #fff;
          border-top-width: 6px;
					border-bottom-width: 0;
				}

			}
		}
</style>
