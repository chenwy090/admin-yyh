

export default function tableMixin() {
    console.log("createTableMixin", Math.random());
    return {
        data() {
            return {
                // 查询条件参数对象
                searchData: {},
                // 表格
                tableLoading: false,
                tableColumns: {},
                tableData: [],
                // 分页
                page: {
                    pageNum: 1, //页码
                    pageSize: 10, //每页数量
                    total: 0 //数据总数
                },
                total: 0,
                pageNo: 1,
                pageSize: 10,
            }
        },
        created() {
            this.queryTableData()
        },
        methods: {
            // 刷新搜索 不修改分页数据
            refresh() {
                this.queryTableData();
            },
            // 重置查询参数
            reset() {
                // 重置查询参数
                this.searchData = {};
                this.page = {
                    pageNum: 1, //页码
                    pageSize: 10, //每页数量
                    total: 0 //数据总数
                };
                //重新查询一遍
                this.queryTableData();
            },
            // 预申明，防止报错
            handleSearchData() {
                this.page.pageNum = 1;
                this.queryTableData()
            },
            // 根据pages和searchData参数 查询数据
            queryTableData() { },
            handleCurrentChange(pageNum) {
                this.page.pageNum = pageNum;
                this.queryTableData()
            },
            handleSizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.queryTableData()
            },
        }
    }
}