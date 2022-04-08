import dayjs from "dayjs"
/**
 * @name: debounce
 * @test: test font
 * @msg: 防抖函数
 * @param
 * @return
 */
export const debounce = (fn, delay) => {
  let timer
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}
/**
 * @name: formatCardInfo
 * @test: test font
 * @msg: 格式化病人卡片信息
 * @param
 * @return
 */

export const formatCardInfo = (times) => {
  times.forEach(item => {
    // **入院天数的格式化
    item.djsj = dayjs(new Date()).diff(item.djsj, 'day') + 1 + '天'
    // **年龄的格式化
    // yexh不为0的话就是婴儿
    if (item.yexh === '0') {
      // item.patientAge = dayjs(item.jzkssj).diff(item.brxxkJz.birth, 'years') + '岁'
      item.patientAge = dayjs(new Date()).diff(item.brxxkJz.birth, 'years') + '岁'
    } else {
      const end = dayjs(new Date()).format('YYYY-MM-DD').replace(/-/g, '/');
      const start = item.brxxkJz.birth.replace(/-/g, '/');
      var date1 = new Date(start); // 开始时间
      var date2 = new Date(end); // 结束时间
      var date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
      // 计算出相差天数
      var days = Math.floor(date3 / (24 * 3600 * 1000));
      /* 年数 */
      var years = Math.floor(days / 365);
      /* 月数 */
      var month1 = days % 365;
      var months = Math.floor(month1 / 30);
      // 计算出小时数
      var leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      const data = [years, months, days, hours, minutes];
      var hourss = data[2] * 24;
      if (hourss < 24) {
        item.patientAge = data[3] + '小时' + data[4] + '分';
      } else if (hourss >= 24 && hourss < 24 * 30) {
        item.patientAge = data[2] + '天' + data[3] + '小时';
      } else if (hourss >= 24 * 30 && hourss < 24 * 30 * 12) {
        item.patientAge = data[1] + '月' + (data[2] % data[1]) + '天';
      } else if (hourss >= 24 * 30 * 12 && hourss < 24 * 30 * 12 * 3) {
        item.patientAge = data[0] + '岁' + data[1] + '月';
      } else if (hourss > 24 * 30 * 12 * 3) {
        item.patientAge = data[0] + '岁';
      }
    }
    // **头像信息的格式化
    if (item.yexh === '0') {
      var patientAge = dayjs(item.jzkssj).diff(item.brxxkJz.birth, 'years')
      var patientInfo = item.brxxkJz;

      if (patientAge !== '未知') {
        if ((patientAge >= 0 && patientAge <= 7) || /.*[\u4e00-\u9fa5]+.*$/.test(patientAge)) {
          if (patientInfo.xbmc.replace(/ /g, '') === '男') {
            item.sexname = 'baby-boy';
          } else if (patientInfo.xbmc.replace(/ /g, '') === '女') {
            item.sexname = 'baby-girl';
          } else {
            item.sexname = 'unknown-sex';
          }
        } else if (patientAge > 7 && patientAge <= 60) {
          if (patientInfo.xbmc.replace(/ /g, '') === '男') {
            item.sexname = 'man';
          } else if (patientInfo.xbmc.replace(/ /g, '') === '女') {
            item.sexname = 'woman';
          } else {
            item.sexname = 'unknown-sex';
          }
        } else if (patientAge > 60) {
          if (patientInfo.xbmc.replace(/ /g, '') === '男') {
            item.sexname = 'old-man';
          } else if (patientInfo.xbmc.replace(/ /g, '') === '女') {
            item.sexname = 'old-woman';
          } else {
            item.sexname = 'unknown-sex';
          }
        }
      } else {
        if (patientInfo.xbmc.replace(/ /g, '') === '男') {
          item.sexname = 'unknown-man';
        } else if (patientInfo.xbmc.replace(/ /g, '') === '女') {
          item.sexname = 'unknown-woman';
        } else {
          item.sexname = 'unknown-sex';
        }
      }
    } else {
      if (item.brxxkJz.xbmc.replace(/ /g, '') === '男') {
        item.sexname = 'baby-boy';
      } else if (patientInfo.xbmc.replace(/ /g, '') === '女') {
        item.sexname = 'baby-girl';
      } else {
        item.sexname = 'unknown-sex';
      }
    }

    // 病人危重等级信息的格式化
    if (item.hljbmc) {
      if (item.hljbmc.indexOf('特') >= 0) {
        item.showNursingLevel = 'tjhl';
      } else if (
        item.hljbmc.indexOf('一') >= 0 ||
              item.hljbmc.indexOf('1') >= 0 ||
              item.hljbmc.indexOf('Ⅰ') >= 0 ||
              item.hljbmc.indexOf('I') >= 0
      ) {
        item.showNursingLevel = 'yjhl';
      } else if (
        item.hljbmc.indexOf('二') >= 0 ||
              item.hljbmc.indexOf('2') >= 0 ||
              item.hljbmc.indexOf('Ⅱ') >= 0 ||
              item.hljbmc.indexOf('II') >= 0
      ) {
        item.showNursingLevel = 'ejhl';
      } else if (
        item.hljbmc.indexOf('三') >= 0 ||
              item.hljbmc.indexOf('3') >= 0 ||
              item.hljbmc.indexOf('Ⅲ') >= 0 ||
              item.hljbmc.indexOf('III') >= 0
      ) {
        item.showNursingLevel = 'sjhl';
      }
    }
  })

  return times
}

// 根据生日结算年龄的函数

export const formatDuration = (duration) => {
  const end = dayjs(new Date()).format('YYYY-MM-DD').replace(/-/g, '/');
  const start = duration.replace(/-/g, '/');
  var date1 = new Date(start); // 开始时间
  var date2 = new Date(end); // 结束时间
  var date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
  // 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  /* 年数 */
  var years = Math.floor(days / 365);
  /* 月数 */
  var month1 = days % 365;
  var months = Math.floor(month1 / 30);
  // 计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  const data = [years, months, days, hours, minutes];
  var hourss = data[2] * 24;
  if (hourss < 24) {
    duration = data[3] + '小时' + data[4] + '分';
  } else if (hourss >= 24 && hourss < 24 * 30) {
    duration = data[2] + '天' + data[3] + '小时';
  } else if (hourss >= 24 * 30 && hourss < 24 * 30 * 12) {
    duration = data[1] + '月' + (data[2] % data[1]) + '天';
  } else if (hourss >= 24 * 30 * 12 && hourss < 24 * 30 * 12 * 3) {
    duration = data[0] + '岁' + data[1] + '月';
  } else if (hourss > 24 * 30 * 12 * 3) {
    duration = data[0] + '岁';
  }
  return duration
}
