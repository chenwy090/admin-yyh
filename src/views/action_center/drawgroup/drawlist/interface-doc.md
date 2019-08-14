 6.置顶
 请求路由：/drawDaily/banner/upTotop
 请求参数：
    /**
     * 主键
     */
    @NotNull
    @ApiModelProperty(value = "主键")
    private Long id;
    /**
     * 1:置顶、0：不置顶
     */
    @NotNull
    @ApiModelProperty(value = "1:置顶、0：不置顶")
    private Integer isTop;




5.每日排期活动分页查询
 请求路由：/drawDaily/banner/activitylist
 请求参数：
  /**
     * 1:单人团、2：多人团
     */
    @ApiModelProperty(value = "团类型，0-全部、1-单人团、2-多人团")
    private Integer groupType;

    @ApiModelProperty(value = "抽奖开始时间，yyyy-MM-dd")
    private String startTime;

    @NotNull(message = "页码不能为空")
    @ApiModelProperty(value = "页码", required = true)
    private Integer pageNum;

    @NotNull(message = "页容量不能为空")
    @ApiModelProperty(value = "页容量", required = true)
    private Integer pageSize;

 返回参数：
 
    @ApiModelProperty(value = "id")
    private Long id;

    @ApiModelProperty(value = "活动名称")
    private String name;

  
    @ApiModelProperty(value = "团类型")
    private String groupType;



   
    @ApiModelProperty(value = "大奖名称")
    private String bigPrizeName;

  
    @ApiModelProperty(value = "阳光普照奖名称")
    private String normalPrizeName;



   
    @ApiModelProperty(value = "广告主名称")
    private String advertName;

    @ApiModelProperty(value = "抽奖开始时间")
    private String startTime;

   
    @ApiModelProperty(value = "开奖时间")
    private String openDrawTime;