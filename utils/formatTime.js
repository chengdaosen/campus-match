export default function getCurrentDateTime() {
  const currentTime = new Date(); // 获取当前时间

  // 获取年、月、日、时、分、秒
  const year = currentTime.getFullYear();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1，并确保两位数格式
  const day = currentTime.getDate().toString().padStart(2, '0'); // 确保两位数格式
  const hours = currentTime.getHours().toString().padStart(2, '0'); // 确保两位数格式
  const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // 确保两位数格式
  const seconds = currentTime.getSeconds().toString().padStart(2, '0'); // 确保两位数格式

  // 组合成 YYYY-MM-DD HH:MM:SS 格式
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}
