<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getMessageList } from '~/api'

const today0 = new Date()
today0.setMonth(today0.getMonth() - 1)
today0.setHours(0, 0, 0, 0)
const today1 = new Date()
today1.setHours(23, 59, 59, 999)
const datetimerange = ref<[Date, Date]>([today0, today1])

const pageInfo = ref({
  pageNum: 1,
  pageSize: 30,
  studentName: '',
  schoolName: '',
  beginTime: '',
  endTime: '',
  phoneNumber: '',
})
const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]
const tableData = ref<any[]>([])

function formatDate(dateStr: any) {
  const date = new Date(dateStr)

  const pad = (n: any) => {
    return String(n).padStart(2, '0')
  }

  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())

  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function getMessageListByPageNumb() {
  console.log('getMessageListByPageNumb')
  let beginTime = ''
  let endTime = ''
  if (datetimerange.value.length > 1) {
    beginTime = formatDate(datetimerange.value[0] || '')
    endTime = formatDate(datetimerange.value[1] || '')
  }

  const param = {
    ...pageInfo.value,
    beginTime,
    endTime,
  }
  getMessageList(param).then((res: any) => {
    tableData.value = res?.messagePoList || []
  }).catch(() => {
    tableData.value = []
  })
}

onMounted(() => {
  getMessageListByPageNumb()
})
</script>

<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-container>
      <el-main>
        <div class="search-bar">
          <el-input
            v-model="pageInfo.studentName"
            style="max-width: 240px;height: 50%;"
            placeholder="请输入学生姓名"
            @keyup.enter="getMessageListByPageNumb()"
          >
            <template #prepend>
              学生姓名
            </template>
          </el-input>
          <el-input
            v-model="pageInfo.schoolName"
            style="margin-left: 10px; max-width: 240px;height: 50%;"
            placeholder="请输入学校名称"
            @keyup.enter="getMessageListByPageNumb()"
          >
            <template #prepend>
              学校名称
            </template>
          </el-input>
          <el-input
            v-model="pageInfo.phoneNumber"
            style="margin-left: 10px; max-width: 240px;height: 50%;"
            placeholder="请输入手机号"
            @keyup.enter="getMessageListByPageNumb()"
          >
            <template #prepend>
              手机号
            </template>
          </el-input>
          <div style="margin-left: 10px; height: 50%;">
            <el-date-picker
              v-model="datetimerange"
              style="height: 100%;"
              type="datetimerange"
              :shortcuts="shortcuts"
              format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="起始时间"
              end-placeholder="截止时间"
            />
          </div>
          <el-button style="margin-left: 10px;height: 50%;" @click="getMessageListByPageNumb()">
            查询
          </el-button>
        </div>
        <el-table :data="tableData" height="85%">
          <el-table-column prop="studentName" label="学生姓名" width="120" />
          <el-table-column prop="schoolName" label="学校名称" width="220" />
          <el-table-column prop="phoneNumber" label="手机号" width="220" />
          <el-table-column prop="message" label="咨询内容" width="600" />
          <el-table-column prop="createTime" label="创建时间" />
        </el-table>
        <div class="pagination-bar-space">
          <el-pagination v-model:current-page="pageInfo.pageNum" class="pagination-bar" background layout="prev, pager, next" :total="1000" @current-change="getMessageListByPageNumb()" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 9%;
}
.pagination-bar-space {
  display: flex;
  flex-direction: row-reverse;
}
.pagination-bar {
  margin-top: 1%;
  height: 5%;
}
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
