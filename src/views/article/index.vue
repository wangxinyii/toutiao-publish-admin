<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option
                label="全部"
                :value="null"
            ></el-option>
            <el-option
                :label="channel.name"
                :value="channel.id"
                v-for="(channel, index) in channels"
                :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              :disabled="loading"
              @click="lodeArticles"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{totalCount}} 条结果：
      </div>
      <!-- 数据列表 -->
      <el-table
          :data="articles"
          stripe
          style="width: 100%"
          class="list-table"
          size="mini"
          v-loading="loading"
      >
        <el-table-column
            prop="date"
            label="封面"
            width="180">
          <template slot-scope="scope">
            <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.cover.images[0]"
                fit="cover"
                lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!--<img v-if="scope.row.cover.images[0]" class="article-cover"
                :src="scope.row.cover.images[0]" alt="">
            <img v-else class="article-cover"
                 src="./img1.jpg" alt="">-->
          </template>
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            width="180">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text}}</el-tag>
<!--            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核成功</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag>
            -->
          </template>
        </el-table-column>
        <el-table-column
            prop="pubdate"
            label="发布时间"
            width="180">
        </el-table-column>
        <el-table-column
            label="操作"
        >
          <template slot-scope="scope">
            <el-button
                size="mini"
                circle
                icon="el-icon-edit"
                type="primary"
            ></el-button>
            <el-button
                size="mini"
                type="danger"
                circle
                icon="el-icon-delete"
                @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->

      <!-- 列表分页 -->
      <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :disabled="loading"
          :page-size="pageSize"
          :current-page.sync="page"
          @current-change="onCurrentChange"
      />
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles,
  getArticleChannels,
  deleteArticle
} from "@/api/article";

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [], // 文章数据列表
      articleStatus: [
        {status: 0, text: '草稿', type: 'info'},
        {status: 1, text: '待审核', type: ''},
        {status: 2, text: '审核成功', type: 'success'},
        {status: 3, text: '审核失败', type: 'warning'},
        {status: 4, text: '已删除', type: 'danger'}
      ],
      totalCount: 0, //总条数
      pageSize: 10, //每页展示的个数
      status: null, //查询的状态
      page: 1,
      channels: [], //频道列表
      channelId: null, //频道 id
      rangeDate: null, //筛选范围日期
      loading: true

    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    this.lodeArticles(1)
  },
  mounted () {},
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    lodeArticles() {
      this.loading = true
      getArticles(
          {
            page: this.page,
            per_page: this.pageSize,
            status: this.status,
            channel_id: this.channelId,
            begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
            end_pubdate: this.rangeDate ? this.rangeDate[1] : null
          }
      ).then(res => {
        console.log(res);
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        this.loading = false
      })
    },
    onCurrentChange(page) {
      //console.log(page);
      this.page=page
      this.lodeArticles()
    },
    loadChannels() {
      getArticleChannels().then(res => {
        console.log(res);
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle(articleId) {
      //console.log("onDeleteArtcile");
      console.log(articleId);
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.lodeArticles(this.page)
        })

      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 60px;
  background-size: cover;
}
</style>