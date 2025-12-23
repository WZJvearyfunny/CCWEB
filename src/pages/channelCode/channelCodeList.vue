<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { VueUiDonut } from 'vue-data-ui'
import { groupByChannel } from '~/api'
import 'vue-data-ui/style.css'

const today0 = new Date()
today0.setMonth(today0.getMonth() - 1)
today0.setHours(0, 0, 0, 0)
const today1 = new Date()
today1.setHours(23, 59, 59, 999)
const datetimerange = ref<[Date, Date]>([today0, today1])
const pageInfo = ref({
  pageNum: 1,
  pageSize: 30,
  beginTime: '',
  endTime: '',
  total: 0,
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

const showDonutDialog = ref(false)

const config = ref<any>({
  debug: false,
  type: 'classic',
  loading: false,
  pie: false,
  autoSize: false,
  responsive: false,
  theme: '',
  customPalette: [],
  useCssAnimation: true,
  events: {
    datapointEnter: null,
    datapointLeave: null,
    datapointClick: null,
  },
  serieToggleAnimation: {
    show: true,
    durationMs: 500,
  },
  startAnimation: {
    show: true,
    durationMs: 1000,
    staggerMs: 50,
  },
  useBlurOnHover: true,
  userOptions: {
    show: true,
    showOnChartHover: false,
    keepStateOnChartLeave: true,
    position: 'right',
    buttons: {
      img: true,
      fullscreen: true,
    },
    callbacks: {
      fullscreen: null,
      img: null,
    },
    buttonTitles: {
      img: 'Download PNG',
      fullscreen: 'Toggle fullscreen',
    },
    print: {
      scale: 2,
      orientation: 'auto',
      overflowTolerance: 0.2,
    },
  },
  translations: {
    total: 'Total',
    average: 'Average',
  },
  table: {
    show: false,
    responsiveBreakpoint: 400,
    useDialog: false,
    th: {
      backgroundColor: '#FFFFFFff',
      color: '#1A1A1Aff',
      outline: 'none',
    },
    td: {
      backgroundColor: '#FFFFFFff',
      color: '#1A1A1Aff',
      outline: 'none',
      roundingValue: 0,
      roundingPercentage: 0,
    },
    columnNames: {
      series: 'Series',
      value: 'Value',
      percentage: 'Percentage',
    },
  },
  style: {
    fontFamily: 'inherit',
    chart: {
      useGradient: false,
      gradientIntensity: 40,
      backgroundColor: '#FFFFFFff',
      color: '#1A1A1Aff',
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      width: 512,
      height: 360,
      layout: {
        curvedMarkers: false,
        labels: {
          dataLabels: {
            showValueFirst: true,
            usePercentageParens: true,
            useValueParens: false,
            show: true,
            useLabelSlots: false,
            hideUnderValue: 3,
            smallArcClusterThreshold: 8,
            smallArcClusterFontSize: 12,
            oneLine: false,
            prefix: '',
            suffix: '',
          },
          value: {
            rounding: 0,
            show: true,
            formatter: null,
          },
          percentage: {
            color: '#1A1A1Aff',
            bold: true,
            fontSize: 18,
            minFontSize: 6,
            rounding: 0,
            formatter: null,
          },
          name: {
            color: '#1A1A1Aff',
            bold: false,
            fontSize: 14,
            minFontSize: 6,
          },
          hollow: {
            show: true,
            total: {
              show: true,
              bold: false,
              fontSize: 18,
              color: '#AAAAAAff',
              text: 'Total',
              offsetY: 0,
              value: {
                color: '#1A1A1Aff',
                fontSize: 18,
                bold: true,
                suffix: '',
                prefix: '',
                offsetY: 0,
                rounding: 0,
                formatter: null,
              },
            },
            average: {
              show: true,
              bold: false,
              fontSize: 18,
              color: '#AAAAAAff',
              text: 'Average',
              offsetY: 0,
              value: {
                color: '#1A1A1Aff',
                fontSize: 18,
                bold: true,
                suffix: '',
                prefix: '',
                offsetY: 0,
                rounding: 0,
                formatter: null,
              },
            },
          },
        },
        donut: {
          radiusRatio: 0.3,
          strokeWidth: 64,
          borderWidth: 1,
          useShadow: false,
          shadowColor: '#1A1A1A',
          emptyFill: '#E1E5E8',
          selectedColor: '#0000001A',
          borderColorAuto: true,
          borderColor: '#CCCCCC',
        },
      },
      comments: {
        show: true,
        showInTooltip: true,
        width: 100,
        offsetY: 0,
        offsetX: 0,
      },
      legend: {
        show: true,
        bold: false,
        backgroundColor: '#FFFFFFff',
        color: '#1A1A1Aff',
        fontSize: 16,
        showValueFirst: true,
        usePercentageParens: true,
        useValueParens: false,
        roundingValue: 0,
        roundingPercentage: 0,
        showPercentage: true,
        showValue: true,
        position: 'bottom',
      },
      tooltip: {
        show: true,
        color: '#1A1A1Aff',
        backgroundColor: '#FFFFFFff',
        fontSize: 14,
        customFormat: null,
        borderRadius: 4,
        borderColor: '#e1e5e8',
        borderWidth: 1,
        backgroundOpacity: 30,
        position: 'center',
        offsetY: 24,
        smooth: true,
        backdropFilter: true,
        smoothForce: 0.18,
        smoothSnapThreshold: 0.25,
        showValueFirst: true,
        usePercentageParens: true,
        useValueParens: false,
        showValue: true,
        showPercentage: true,
        roundingValue: 0,
        roundingPercentage: 0,
      },
    },
  },
})

const dataset = ref<any[]>([])

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
  groupByChannel(param).then((res: any) => {
    tableData.value = res?.dailyRegisterList || []
    pageInfo.value.total = res?.total || 0
    const datasetByChannel: any[] = []
    tableData.value.forEach((item: any) => {
      const index = datasetByChannel.findIndex((channel: any) => channel.name === item.channelCode)
      if (index < 0) {
        datasetByChannel.push({
          name: item.channelCode,
          values: [item.registerCount],
        })
      }
      else {
        datasetByChannel[index].values[0] = datasetByChannel[index].values[0] + item.registerCount
      }
    })
    dataset.value = datasetByChannel
  }).catch(() => {
    tableData.value = []
    dataset.value = []
  })
}

function toolShowDonutDialog() {
  if (dataset.value.length > 0) {
    showDonutDialog.value = true
  }
  else {
    ElMessage.error('暂无数据')
  }
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
          <h3>渠道分析（非实名）</h3>
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
          <el-button style="margin-left: 10px;height: 50%;" @click="toolShowDonutDialog()">
            统计
          </el-button>
        </div>
        <el-table :data="tableData" height="85%">
          <el-table-column prop="channelCode" label="渠道号" />
          <el-table-column prop="registerCount" label="数量" />
          <el-table-column prop="registerDate" label="统计日期" />
        </el-table>
        <div class="pagination-bar-space">
          <el-pagination v-model:current-page="pageInfo.pageNum" class="pagination-bar" background layout="prev, pager, next" :total="pageInfo.total" @current-change="getMessageListByPageNumb()" />
        </div>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog
    v-model="showDonutDialog"
    width="900"
  >
    <VueUiDonut
      :config="config"
      :dataset="dataset"
    />
  </el-dialog>
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
