/*
 * ═══════════════════════════════════════════════════════════
 * GLOSS & CORE — Google Apps Script для приёма заявок
 * ═══════════════════════════════════════════════════════════
 *
 * ИНСТРУКЦИЯ ПО ПОДКЛЮЧЕНИЮ:
 *
 * 1. Откройте Google Sheets: https://sheets.google.com
 * 2. Создайте новую таблицу с названием «Gloss & Core — Заявки»
 * 3. В первой строке создайте заголовки:
 *    A1: Дата | B1: Имя | C1: Телефон | D1: Источник | E1: Статус
 * 4. Откройте: Расширения → Apps Script
 * 5. Удалите код по умолчанию и вставьте весь код ниже
 * 6. Нажмите «Сохранить» (Ctrl+S)
 * 7. Нажмите «Развернуть» → «Новое развёртывание»
 * 8. Тип: «Веб-приложение»
 * 9. Доступ: «Доступно всем»
 * 10. Нажмите «Развернуть»
 * 11. Скопируйте URL веб-приложения
 * 12. Вставьте URL в файл script.js в переменную SCRIPT_URL (строка ~197)
 *
 * Готово! Теперь заявки с сайта будут приходить в вашу таблицу.
 * ═══════════════════════════════════════════════════════════
 */

// Обработчик POST-запросов с сайта
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Добавляем новую строку с данными
    sheet.appendRow([
      data.date || new Date().toLocaleString('ru-RU'),  // Дата
      data.name || '',                                    // Имя
      data.phone || '',                                   // Телефон
      data.source || 'Сайт',                             // Источник
      'Новая'                                             // Статус
    ]);

    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Обработчик GET-запросов (для проверки работоспособности)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Gloss & Core form endpoint is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Тестовая функция (запустите вручную для проверки)
function testAppendRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date().toLocaleString('ru-RU'),
    'Тест',
    '+7 (999) 123-45-67',
    'Тестовая отправка',
    'Новая'
  ]);
}
