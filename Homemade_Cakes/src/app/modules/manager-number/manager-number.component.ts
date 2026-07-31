import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  VirtualScrollService,
  SelectionService,
  GridComponent,
  QueryCellInfoEventArgs,
  GridModule,
  PageService,
  SortService,
  FilterService,
  GroupService,
} from '@syncfusion/ej2-angular-grids';
import { ButtonComponent, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import {
  NumericTextBoxComponent,
  NumericTextBoxModule,
} from '@syncfusion/ej2-angular-inputs';

import { L10n, setCulture, EmitType } from '@syncfusion/ej2-base';
import { ManagerNumberService } from './manager-number.service';
import { BehaviorSubject } from 'rxjs';
// import { getTradeData } from './data';
// import { SBDescriptionComponent } from '../common/dp.component';
// import { SBActionDescriptionComponent } from '../common/adp.component';
import { createWorker } from 'tesseract.js'; //Bóc OCR

@Component({
  selector: 'app-manager-number',
  templateUrl: './manager-number.component.html',
  styleUrls: ['./manager-number.component.scss'],

})
export class ManagerNumberComponent implements OnInit {
  isDataBound: boolean = true;
  data: object[] = [];
  dReady: boolean = false;
  @ViewChild('livestream')
  gridInstance: GridComponent;
  @ViewChild('update')
  updateButton: ButtonComponent;
  @ViewChild('clear')
  clearButton: ButtonComponent;
  @ViewChild('feeddelay')
  feedDelayInput: NumericTextBoxComponent;

  timerID: any;
  initial: boolean = true;
  pageSettings: { pageCount: number; };
  loadingIndicator: { indicatorType: string; };
  menu = '3';
  countOCR = 0;
  ocrScale = 2; //chuẩn là 2
  psmMode: string = '6'; // mặc định 6 vì đang chuẩn

  constructor(
    private serviceNum: ManagerNumberService,
    private changdef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.data = this.serviceNum.data
    this.pageSettings = { pageCount: 3 };
    // this.data = new DataManager({ url: 'https://services.syncfusion.com/angular/production/api/orders', adaptor: new UrlAdaptor });
    this.loadingIndicator = { indicatorType: 'Spinner' };
    //khai baaso
    this.serviceNum.menuClick.subscribe(e => {
      this.menu = e ?? '3';
      this.changdef.detectChanges();
    })
    this.createArr();

  }

  ngOnDestroy(): void {
    // this.destroyClear(undefined);
  }

  ngAfterViewInit(args: any): void {
    // if (this.initial) {
    //   document.getElementById('update').click();
    //   this.initial = false;
    // }
    // this.feedDelayInput.element.addEventListener('keypress', (e: any) => {
    //   if (
    //     e &&
    //     e.key === 'Enter' &&
    //     this.feedDelayInput.element.parentElement.classList.contains(
    //       'e-input-focus'
    //     )
    //   ) {
    //     this.feedDelayInput.value = parseInt(this.feedDelayInput.element.value);
    //     this.feedDelayInput.focusOut();
    //     this.updateButton.element.click();
    //   }
    // });
  }

  updateClick(e) { }

  updateCellDetails(cell: any, className: any) {
    var div = document.createElement('div');
    var span1 = document.createElement('span');
    span1.classList.add('rowcell-left');
    div.classList.add(className);
    span1.innerHTML = cell.innerHTML;
    cell.innerHTML = '';
    div.appendChild(span1);
    cell.appendChild(div);
  }

  destroyClear(_args: any): void {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  clearClick(_args: any): void {
    if (this.timerID) {
      this.updateButton.disabled = false;
      this.feedDelayInput.enabled = true;
      this.clearButton.disabled = true;
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  queryCellInfoEvent: EmitType<QueryCellInfoEventArgs> = (
    args: QueryCellInfoEventArgs
  ) => {
    if (args.column.field === 'NetIncome') {
      if (args.data['Net'] < 0) {
        args.cell.classList.remove('e-increase');
        args.cell.classList.add('e-decrease');
      } else if (args.data['Net'] > 0) {
        args.cell.classList.remove('e-decrease');
        args.cell.classList.add('e-increase');
      }
    } else if (args.column.field === 'Change') {
      if (args.data['Change'] < 0) {
        this.updateCellDetails(args.cell, 'below-0');
      } else {
        this.updateCellDetails(args.cell, 'above-0');
      }
    } else if (args.column.field === 'Net') {
      if (args.data['Net'] < 0) {
        this.updateCellDetails(args.cell, 'below-0');
      } else {
        this.updateCellDetails(args.cell, 'above-0');
      }
    } else if (this.isDataBound) {
      if (args.column.field === 'Rating') {
        args.cell.innerHTML = '';
        const span: Element = document.createElement('span');
        const span2: Element = document.createElement('span');
        if (args.data['Change'] === 0) {
          this.customizeRatingCell(
            span,
            span2,
            [
              'e-icons',
              'e-intermediate-state-2',
              'neutral',
              'ic',
              'side-space',
            ],
            'neutral',
            'Neutral'
          );
        } else if (args.data['Change'] < -2 && args.data['Net'] < 0) {
          this.customizeRatingCell(
            span,
            span2,
            [
              'e-icons',
              'e-negc',
              'e-chevron-down-double',
              'below-0',
              'ic',
              'side-space',
            ],
            'below-0',
            'Strongly Sell'
          );
        } else if (args.data['Net'] < 0) {
          this.customizeRatingCell(
            span,
            span2,
            [
              'e-icons',
              'e-negc',
              'e-chevron-down',
              'below-0',
              'ic',
              'side-space',
            ],
            'below-0',
            'Sell'
          );
        } else if (args.data['Change'] > 5 && args.data['Net'] > 10) {
          this.customizeRatingCell(
            span,
            span2,
            [
              'e-icons',
              'e-posc',
              'e-chevron-up-double',
              'above-0',
              'ic',
              'side-space',
            ],
            'above-0',
            'Strongly Buy'
          );
        } else {
          this.customizeRatingCell(
            span,
            span2,
            [
              'e-icons',
              'e-posc',
              'e-chevron-up',
              'above-0',
              'ic',
              'side-space',
            ],
            'above-0',
            'Buy'
          );
        }
        args.cell.appendChild(span);
        args.cell.appendChild(span2);
      }
    }
    this.isDataBound = true;
  };

  updateCellValues() { //: TimerHandler
    let oldValue: any;
    let newValue: any;
    for (let i: number = 0; i < this.gridInstance.currentViewData.length; i++) {
      if (this.gridInstance.currentViewData[i] === undefined) {
        return;
      }
      let num: number = Math.floor(Math.random() * 99) + 1;
      num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
      oldValue = this.gridInstance.currentViewData[i]['Net'];
      if (i % 2 === 0) {
        num = num * 0.25;
      } else if (i % 3 === 0) {
        num = num * 0.83;
      } else if (i % 5 == 0) {
        num = num * 0.79;
      } else if (i % 4 == 0) {
        num = num * 0.42;
      } else {
        num = num * 0.51;
      }
      this.isDataBound = true;
      this.gridInstance.setCellValue(
        this.gridInstance.currentViewData[i]['id'],
        'Net',
        parseFloat(num.toFixed(2))
      );
      this.isDataBound = true;
      newValue = parseFloat(
        (this.gridInstance.currentViewData[i]['Net'] - oldValue)
          .toString()
          .substring(0, 2)
      );
      this.gridInstance.setCellValue(
        this.gridInstance.currentViewData[i]['id'],
        'Change',
        parseFloat(newValue.toFixed(2))
      );
      this.isDataBound = true;
      let ratingValue: string =
        this.gridInstance.currentViewData[i]['Net'] < 0 ? 'Sell' : 'Buy';
      this.gridInstance.setCellValue(
        this.gridInstance.currentViewData[i]['id'],
        'Rating',
        ratingValue
      );
      let val = num + newValue;
      this.gridInstance.setCellValue(
        this.gridInstance.currentViewData[i]['id'],
        'NetIncome',
        val
      );
    }
  }

  customizeRatingCell(
    span1: Element,
    span2: Element,
    span1_class: string[],
    span2_class: string,
    span2_text: string
  ): void {
    span1_class.forEach((item: string) => span1.classList.add(item));
    span2.classList.add(span2_class);
    (span2 as HTMLElement).innerText = span2_text;
  }


  // valueChange(args: ChangeEventArgs) {
  //     if ((this.dropdown as DropDownListComponent).value === 'Shimmer') {
  //         (this.grid as GridComponent).loadingIndicator.indicatorType = 'Shimmer';
  //         (this.grid as GridComponent).refreshColumns();
  //     } else {
  //         (this.grid as GridComponent).loadingIndicator.indicatorType = 'Spinner';
  //         (this.grid as GridComponent).refreshColumns();
  //     }
  // } 
  //#region  reset 
  arrNumCurrent: any[] = []

  reset() {
    // Hiển thị hộp thoại hỏi Yes/No của trình duyệt
    const confirmReset = confirm("Bạn có chắc chắn muốn xóa hết kết quả đã quét không?");

    if (confirmReset) {
      if (this.menu == '1') {
        //reset thống kê
        this.statsLog = [];
        this.countEnd = null;
        this.arrNumCurrentEnd = [];
        this.statsSelectedNum = null;
        this.statsLastNums = [];
        this.statsCount = 0;
        this.statsError = '';
        this.showStatsLogModal = false;
        this.changdef.detectChanges();
      } else {
        // Nếu người dùng chọn OK mới thực hiện reset
        this.arrNumCurrent.forEach(item => item.isExited = false);
        localStorage.removeItem('arrNum');
        this.countOCR = 0
        localStorage.removeItem('countOCR');
        // this.createArr();
        console.log("Đã reset bảng số.");
      }
    }

  }
  createArr() {
    if (localStorage.getItem('arrNum')) {
      this.arrNumCurrent = JSON.parse(localStorage.getItem('arrNum'));
      let coutOCR = localStorage.getItem('countOCR');
      this.countOCR = coutOCR ? Number.parseInt(coutOCR) : 0;
    }
    this.arrNumCurrent = []
    for (var i = 0; i < 100; i++) {
      let num = i.toString();
      if (i < 10) num = '0' + i
      this.arrNumCurrent.push({
        value: num,
        isExited: false
      })
    }
  }
  clickNum(idx) {
    this.arrNumCurrent[idx].isExited = !this.arrNumCurrent[idx].isExited;
    localStorage.setItem('arrNum', JSON.stringify(this.arrNumCurrent))
  }
  //#region OCR ảnh singer
  loading = false;
  progress = 0
  // 1. Bắt sự kiện chọn file
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      //await this.processOCR(file);
      var image = await this.preprocessImage(file);
      await this.processOCRBase64(image);
    }
  }

  //Phosng to image
  async preprocessImage(imageFile: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

          // Phóng to 2 lần là đủ, quan trọng là độ tương phản
          canvas.width = img.width * this.ocrScale;
          canvas.height = img.height * this.ocrScale;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // BƯỚC QUAN TRỌNG: Lọc màu thông minh
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];

            // Phát hiện chữ ĐỎ (Giải tám, Giải ĐB): r cao, g+b thấp
            const isRed = r > 150 && g < 100 && b < 100;

            // Tính độ sáng (Luminance)
            const brightness = (0.34 * r + 0.5 * g + 0.16 * b);

            // Xổ số thường có chữ Đỏ (Giải 8, ĐB) và chữ Đen (các giải còn lại)
            // Ta ưu tiên giữ lại các vùng có màu đậm (chữ) và biến các vùng nhạt (nền, khung) thành trắng
            // Ngưỡng 130 thường là "điểm ngọt" để tách chữ ra khỏi khung bảng
            const isDark = brightness < 135;

            // Giữ lại nếu là đỏ HOẶC đậm → thành đen
            const isText = isRed || isDark;

            const color = isText ? 0 : 255;
            data[i] = data[i + 1] = data[i + 2] = color;
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png', 1.0));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageFile);
    });
  }
  async processOCRBase64(imageFile64: string) {
    this.loading = true;
    this.progress = 0;

    // 1. Khởi tạo với cấu hình hỗ trợ tiếng Việt (nếu cần đọc tiêu đề) hoặc chỉ eng cho nhanh
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          this.progress = Math.round(m.progress * 100);
        }
      },
      //     //cau hinh tay
      //     //     workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
      //     // langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      //     // corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
    });

    try {
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
        // Chế độ 11 (Sparse text) hoặc 6 (Single block) 
        // Với ảnh này bạn hãy thử lại với PSM 6 sau khi đã Scale ảnh
        tessedit_pageseg_mode: '6' as any,
        // Ép Tesseract coi mọi thứ là số, không đoán chữ
        tessedit_ocr_engine_mode: '1' as any,
      });

      const { data: { text } } = await worker.recognize(imageFile64);

      // Xử lý chuỗi kết quả: Thay vì match trực tiếp, ta làm sạch chuỗi rác trước
      const cleanText = text.replace(/[^0-9\s]/g, '');
      const matches = cleanText.split(/\s+/).filter(num => num.length >= 2);

      if (matches.length > 0) {
        this.updateNumbers(matches);
      } else {
        alert("Không tìm thấy số nào!");
      }

    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      await worker.terminate();
      this.loading = false;
    }
  }

  // 2. Hàm xử lý OCR chính
  async processOCR(imageFile: File) {
    this.loading = true;
    this.progress = 0;

    // 1. Khởi tạo với cấu hình hỗ trợ tiếng Việt (nếu cần đọc tiêu đề) hoặc chỉ eng cho nhanh
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          this.progress = Math.round(m.progress * 100);
        }
      },
      //     //cau hinh tay
      //     //     workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
      //     // langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      //     // corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js',
    });

    try {
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
        // PSM 11 rất mạnh trong việc tìm các con số nằm rải rác trong bảng
        tessedit_pageseg_mode: '11' as any,
      });

      // Thực hiện nhận diện
      const { data: { text } } = await worker.recognize(imageFile);

      // 1. Thay thế tất cả các ký tự không phải số bằng khoảng trắng
      // 2. Tách chuỗi theo khoảng trắng để lấy các mảng số
      const matches = text.replace(/[^\d]/g, ' ').split(/\s+/);

      if (matches) {
        // Loại bỏ các số rác (ví dụ ngày tháng 14022026 hoặc mã đài 2B7)
        // Bạn có thể filter những số quá dài hoặc quá ngắn nếu cần
        const cleanMatches = matches.filter(num => num.length >= 2 && num.length <= 6);
        this.updateNumbers(cleanMatches);
      } else {
        alert("Không tìm thấy số nào!");
      }

    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      await worker.terminate();
      this.loading = false;
    }
  }

  // 3. Cập nhật trạng thái hiển thị
  updateNumbers(detectedList: string[]) {
    // Lấy 2 số cuối của mỗi kết quả OCR (vì xổ số tính lô 2 số cuối)
    const finalNumbers = detectedList.map(num => num.slice(-2));

    this.arrNumCurrent.forEach(item => {
      if (finalNumbers.includes(item.value)) {
        item.isExited = true;
      }
    });
    localStorage.setItem('arrNum', JSON.stringify(this.arrNumCurrent));
    this.countOCR += 1;
    localStorage.setItem('countOCR', this.countOCR.toString());
    alert(`Xong! Đã quét và đối soát ${finalNumbers.length} con số.`);
  }


  // async ocrImage(imageFile: File) {
  //   const worker = await createWorker('eng'); // Số thì dùng 'eng' là đủ

  //   // Bạn có thể thiết lập chỉ nhận diện chữ số để tăng độ chính xác
  //   await worker.setParameters({
  //     tessedit_char_whitelist: '0123456789',
  //   });

  //   const { data: { text } } = await worker.recognize(imageFile);

  //   // text trả về sẽ là chuỗi các số. Bạn cần dùng Regex để bóc tách 
  //   // lấy 2 số cuối (lô) hoặc các giải tùy ý.
  //   const numbers = text.match(/\d{2,}/g);

  //   this.updateGrid(numbers);
  //   await worker.terminate();
  // }

  updateGrid(ocrResults: string[]) {
    // Lấy 2 số cuối của mỗi kết quả
    const exitedNumbers = ocrResults.map(num => num.slice(-2));

    this.arrNumCurrent.forEach(item => {
      if (exitedNumbers.includes(item.value)) {
        item.isExited = true;
      }
    });

    // Hiển thị thông báo sau khi hoàn tất
    alert('Đã cập nhật kết quả từ ảnh!');
  }

  //Dán ANh
  // 1. Lắng nghe sự kiện dán (paste) toàn cục
  // @HostListener('window:paste', ['$event'])
  // onPaste(event: ClipboardEvent) {
  //   // Kiểm tra xem dữ liệu dán có phải là file ảnh không
  //   const items = event.clipboardData?.items;

  //   if (!items || this.loading) return; // Nếu đang quét thì không cho dán

  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].type.indexOf('image') !== -1) {
  //       // Lấy file ảnh từ clipboard
  //       const file = items[i].getAsFile();
  //       if (file) {
  //         console.log('Đã dán ảnh thành công!', file.name);
  //         // 2. Gọi hàm OCR với file ảnh này
  //         this.processOCR(file);
  //         break; // Chỉ xử lý ảnh đầu tiên tìm thấy
  //       }
  //     }
  //   }
  // }

  async onPaste(event: ClipboardEvent) {
    // 1. Lấy danh sách các item từ clipboard
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      // 2. Kiểm tra nếu item đó là hình ảnh
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // Ngăn việc dán text vào ô input (nếu muốn)
          event.preventDefault();

          // 3. Tiến hành OCR
          await this.processOCR(file);
          break;
        }
      }
    }
  }


  //#region Mutil file
  // 1. Bắt sự kiện chọn file multil
  async onFileMultiSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files.length > 0) {
      await this.processMultipleFiles(files);
    }
  }

  // 3. Hàm xử lý nhiều file tuần tự
  async processMultipleFiles(files: File[]) {
    this.loading = true;
    this.progress = 0;

    const allMatches: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const image = await this.preprocessImage(files[i]);
      const matches = await this.processOCRBase64Multi(image, i, files.length);
      allMatches.push(...matches);
    }

    if (allMatches.length > 0) {
      this.updateNumbers(allMatches);
    } else {
      alert('Không tìm thấy số nào!');
    }

    this.loading = false;
  }

  // 4. OCR trả về mảng số thay vì tự gọi updateNumbers
  async processOCRBase64Multi(imageFile64: string, fileIndex: number, totalFiles: number): Promise<string[]> {
    const totalRuns = this.psmMode === 'both' ? 2 : 1;
    let currentRun = 0;

    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          // Mỗi run chiếm 1 phần của 1 file
          const runProgress = (currentRun + m.progress) / totalRuns;
          const fileProgress = runProgress / totalFiles;
          const baseProgress = fileIndex / totalFiles;
          this.progress = Math.round((baseProgress + fileProgress) * 100);
        }
      },
    });
    // const worker = await createWorker('eng', 1, {
    //   logger: m => {
    //     if (m.status === 'recognizing text') {
    //       // Progress tổng = tiến độ file hiện tại chia đều cho tổng số file
    //       const fileProgress = m.progress / totalFiles;
    //       const baseProgress = fileIndex / totalFiles;
    //       this.progress = Math.round((baseProgress + fileProgress) * 100);
    //     }
    //   },
    // });

    try {
      //Mới
      const results = new Set<string>();
      const extract = (text: string) =>
        text.replace(/[^0-9\s]/g, '').split(/\s+/).filter(n => n.length >= 2);

      const runPSM = async (psm: string) => {
        await worker.setParameters({
          tessedit_char_whitelist: '0123456789',
          tessedit_pageseg_mode: psm as any,
          tessedit_ocr_engine_mode: '1' as any,
        });
        const { data: { text } } = await worker.recognize(imageFile64);
        extract(text).forEach(n => results.add(n));
        currentRun++; // tăng SAU khi recognize xong
      };

      if (this.psmMode === 'both') {
        await runPSM('6');
        await runPSM('11');
      } else {
        await runPSM(this.psmMode);
      }

      return Array.from(results);

      //Cũ
      // await worker.setParameters({
      //   tessedit_char_whitelist: '0123456789',
      //   tessedit_pageseg_mode: '6' as any,
      //   tessedit_ocr_engine_mode: '1' as any,
      // });

      // const { data: { text } } = await worker.recognize(imageFile64);

      // const cleanText = text.replace(/[^0-9\s]/g, '');
      // return cleanText.split(/\s+/).filter(num => num.length >= 2);

    } catch (error) {
      console.error(`OCR Error file ${fileIndex + 1}:`, error);
      return [];
    } finally {
      await worker.terminate();
    }
  }

  //#region  Tab thống kê
  /**
   * Danh sách proxy CORS công khai — thử lần lượt, proxy nào sống thì dùng.
   * `encode = true` nếu proxy nhận URL đích qua query param (phải encode),
   * `false` nếu proxy nối thẳng URL đích vào sau.
   */
  statsCorsProxies = [
    { prefix: 'https://proxy.cors.sh/', encode: false },
    { prefix: 'https://api.allorigins.win/raw?url=', encode: true },
    { prefix: 'https://api.codetabs.com/v1/proxy?quest=', encode: true },
  ];
  /** Giãn nhịp giữa các request (ms) để không làm phiền server minhngoc */
  statsDelayMs = 2000; //2s gửi request 1 lần chậm nhưng an toàn
  statsViewMode: 'day' | 'weekday' = 'weekday';
  statsStartDate: string = this.formatDateInput(new Date());
  statsRegions = [
    { key: 'mien-nam', label: 'Miền Nam', selected: true },
    { key: 'mien-trung', label: 'Miền Trung', selected: false },
    { key: 'mien-bac', label: 'Miền Bắc', selected: false },
  ];
  statsLoading = false;
  statsCount = 0;
  countEnd: number | null = null;
  arrNumCurrentEnd: any[] = [];
  statsSelectedNum: any = null;
  statsError = '';
  showStatsLogModal = false;
  /** Nhật ký từng kỳ để đối chiếu với kết quả dò tay */
  statsLog: { count: number; date: string; total: number; uniq: number; newCount: number; remain: number }[] = [];
  /** Số(s) về cuối cùng (exitCount lớn nhất) */
  statsLastNums: any[] = [];
  /** Giới hạn an toàn tránh vòng lặp vô hạn */
  private readonly STATS_MAX_LOOPS = 400;

  get statsExitedCount(): number {
    const list = this.arrNumCurrentEnd?.length ? this.arrNumCurrentEnd : this.arrNumCurrent;
    return (list || []).filter((x: any) => x.isExited).length;
  }

  get statsLastNumLabel(): string {
    if (!this.statsLastNums?.length) return '—';
    return this.statsLastNums.map((x: any) => x.value).join(', ');
  }

  isStatsLastNum(num: any): boolean {
    return !!num && this.statsLastNums.some((x: any) => x.value === num.value);
  }

  /** Tìm số về muộn nhất (exitCount max) để highlight */
  private resolveStatsLastNums(list: any[]) {
    const exited = (list || []).filter((x: any) => x.isExited && x.exitCount != null);
    if (!exited.length) {
      this.statsLastNums = [];
      return;
    }
    const maxCount = Math.max(...exited.map((x: any) => x.exitCount));
    this.statsLastNums = exited.filter((x: any) => x.exitCount === maxCount);
    // đánh dấu trên từng phần tử để dễ style
    (list || []).forEach((x: any) => {
      x.isLast = this.statsLastNums.some((l: any) => l.value === x.value);
    });
  }

  toggleStatsRegion(region: { key: string; label: string; selected: boolean }) {
    region.selected = !region.selected;
  }

  /** Format Date -> yyyy-MM-dd cho input[type=date] */
  private formatDateInput(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /** Format Date -> dd-MM-yyyy (URL minhngoc) */
  private formatDateMinhNgoc(d: Date): string {
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}-${m}-${d.getFullYear()}`;
  }

  private parseDateInput(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  private cloneDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private addDays(d: Date, n: number): Date {
    const x = this.cloneDate(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  /**
   * Theo thứ: lấy ngày có cùng thứ với ngày gốc, gần nhất tính từ `from` trở về trước (kể cả `from`).
   */
  private nearestSameWeekday(from: Date, weekday: number): Date {
    const d = this.cloneDate(from);
    while (d.getDay() !== weekday) {
      d.setDate(d.getDate() - 1);
    }
    return d;
  }

  /** Reset 100 số về trạng thái chưa về */
  private resetStatsArray(): any[] {
    const arr: any[] = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        value: i < 10 ? '0' + i : String(i),
        isExited: false,
        exitDate: undefined,
        exitCount: undefined,
      });
    }
    return arr;
  }

  clickStatsNum(num: any) {
    this.statsSelectedNum = num;
  }

  /**
   * CORE: Bắt đầu thống kê chu kỳ về đủ 00–99
   */
  async startStatistics() {
    const selected = this.statsRegions.filter(r => r.selected).map(r => r.key);
    if (!selected.length) {
      alert('Vui lòng chọn ít nhất 1 khu vực (Miền).');
      return;
    }
    if (!this.statsStartDate) {
      alert('Vui lòng chọn ngày bắt đầu.');
      return;
    }

    this.statsLoading = true;
    this.countEnd = null;
    this.arrNumCurrentEnd = [];
    this.statsSelectedNum = null;
    this.statsLastNums = [];
    this.statsCount = 0;
    this.statsLog = [];
    this.statsError = '';
    this.showStatsLogModal = false;

    // Bước 1: khởi tạo
    let count = 0; // số kỳ đã duyệt (đếm từ 1 cho khớp cách dò tay)
    this.arrNumCurrent = this.resetStatsArray();
    let currentDate = this.parseDateInput(this.statsStartDate);
    const targetWeekday = currentDate.getDay(); // thứ của Select 3

    try {
      while (count < this.STATS_MAX_LOOPS) {
        // Bước 2.1: xác định ngày cần lấy KQ
        let fetchDate = this.cloneDate(currentDate);
        if (this.statsViewMode === 'weekday') {
          fetchDate = this.nearestSameWeekday(currentDate, targetWeekday);
        }

        // Giãn nhịp giữa các kỳ
        if (count > 0) {
          await this.sleep(this.statsDelayMs);
        }

        // Bước 2.2 + 2.3: fetch & trích 2 số đuôi
        const tails = await this.fetchLotteryData(fetchDate, selected);
        count += 1;

        // Bước 2.4: đánh dấu số lần đầu xuất hiện
        const dateLabel = this.formatDateMinhNgoc(fetchDate);
        let newCount = 0;
        for (const tail of tails) {
          const item = this.arrNumCurrent.find((x: any) => x.value === tail);
          if (item && !item.isExited) {
            item.isExited = true;
            item.exitDate = dateLabel;
            item.exitCount = count;
            newCount++;
          }
        }

        this.statsCount = count;
        this.statsLog.push({
          count,
          date: dateLabel,
          total: tails.length,
          uniq: new Set(tails).size,
          newCount,
          remain: 100 - this.arrNumCurrent.filter((x: any) => x.isExited).length,
        });
        this.changdef.detectChanges();

        // Bước 2.5: điều kiện dừng
        const allExited = this.arrNumCurrent.every((x: any) => x.isExited);
        if (allExited) {
          this.countEnd = count;
          this.arrNumCurrentEnd = this.arrNumCurrent.map(x => ({ ...x }));
          this.resolveStatsLastNums(this.arrNumCurrentEnd);
          break;
        }

        // Lùi về kỳ tiếp theo
        if (this.statsViewMode === 'weekday') {
          currentDate = this.addDays(fetchDate, -7); // cùng thứ, tuần trước
        } else {
          currentDate = this.addDays(fetchDate, -1);
        }
      }

      if (this.countEnd == null) {
        // Chưa đủ 100 số trong giới hạn — vẫn lưu kết quả hiện tại
        this.countEnd = count;
        this.arrNumCurrentEnd = this.arrNumCurrent.map(x => ({ ...x }));
        this.resolveStatsLastNums(this.arrNumCurrentEnd);
        alert(`Đã duyệt ${count} kỳ nhưng chưa về đủ 100 số. Còn ${100 - this.statsExitedCount} số chưa về.\nSố về muộn nhất hiện tại: ${this.statsLastNumLabel}`);
      } else {
        alert(`Hoàn tất! Cần ${this.countEnd} kỳ để về đủ 100 bộ số.\nSố tồn tại cuối cùng: ${this.statsLastNumLabel}`);
      }
    } catch (err: any) {
      console.error('startStatistics error:', err);
      // Dừng hẳn khi không lấy được dữ liệu thật, tránh trả ra con số sai
      this.arrNumCurrentEnd = this.arrNumCurrent.map(x => ({ ...x }));
      this.resolveStatsLastNums(this.arrNumCurrentEnd);
      this.statsError = err?.message || 'Lỗi không xác định';
      alert(`Dừng ở kỳ ${count} vì không lấy được dữ liệu:\n${this.statsError}`);
    } finally {
      this.statsLoading = false;
      this.changdef.detectChanges();
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper: lấy KQXS theo ngày + miền.
   * Không có mock data — fetch lỗi thì báo lỗi để kết quả thống kê luôn là số thật.
   */
  async fetchLotteryData(date: Date, regions: string[]): Promise<string[]> {
    const allNumbers: string[] = [];
    for (let i = 0; i < regions.length; i++) {
      // Giãn nhịp giữa các request để không dội vào server của minhngoc
      if (i > 0) {
        await this.sleep(this.statsDelayMs);
      }
      const numbers = await this.fetchOneRegion(date, regions[i]);
      allNumbers.push(...numbers);
    }
    // Chuẩn hóa: chỉ giữ 2 chữ số cuối
    return allNumbers
      .map(n => String(n).replace(/\D/g, ''))
      .filter(n => n.length >= 2)
      .map(n => n.slice(-2));
  }

  private async fetchOneRegion(date: Date, region: string): Promise<string[]> {
    const dateStr = this.formatDateMinhNgoc(date);
    const targetUrl = `https://www.minhngoc.net.vn/ket-qua-xo-so/${region}/${dateStr}.html`;

    let lastErr: any = null;
    // Thử lần lượt các proxy, proxy nào trả về HTML hợp lệ thì dùng
    for (const proxy of this.statsCorsProxies) {
      const proxyUrl = proxy.prefix + (proxy.encode ? encodeURIComponent(targetUrl) : targetUrl);
      try {
        const res = await fetch(proxyUrl, { method: 'GET' });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const html = await res.text();
        if (!html || html.length < 5000) {
          throw new Error('HTML rỗng/không hợp lệ');
        }
        return this.parseMinhNgocHtml(html, dateStr);
      } catch (e) {
        lastErr = e;
        console.warn(`Proxy lỗi (${proxy.prefix}) - ${region} ${dateStr}:`, e);
        await this.sleep(this.statsDelayMs);
      }
    }
    throw new Error(`Không lấy được KQXS ${region} ngày ${dateStr}: ${lastErr?.message || lastErr}`);
  }

  /**
   * Parse HTML minhngoc.
   * Trang 1 ngày còn kèm kết quả nhiều ngày khác (7 bảng) nên bắt buộc phải
   * lọc đúng box có <td class="ngay"> khớp ngày đang xét, nếu không sẽ ăn nhầm
   * số của các ngày khác và chu kỳ thống kê bị sai.
   */
  private parseMinhNgocHtml(html: string, dateStr: string): string[] {
    const clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
    const dateSlash = dateStr.replace(/-/g, '/'); // dd/MM/yyyy hiển thị trên trang

    const results: string[] = [];
    const boxes = clean.split(/<div class="box_kqxs">/i).slice(1);

    for (const box of boxes) {
      const ngayCell = box.match(/<td[^>]*class="ngay"[^>]*>([\s\S]*?)<\/td>/i);
      if (!ngayCell || ngayCell[1].indexOf(dateSlash) === -1) continue;

      // Trong box: mỗi giải nằm ở <td class="giai1..8|giaidb"><div>số</div></td>
      const tdRegex = /<td[^>]*class="(?:giai\d|giaidb)"[^>]*>([\s\S]*?)<\/td>/gi;
      let td: RegExpExecArray | null;
      while ((td = tdRegex.exec(box)) !== null) {
        const divRegex = /<div[^>]*>\s*(\d{2,6})\s*<\/div>/gi;
        let dv: RegExpExecArray | null;
        while ((dv = divRegex.exec(td[1])) !== null) {
          results.push(dv[1]);
        }
      }
    }
    return results;
  }
  //#endregion

}
export class NumClass {
  public value: string;
  public isExited: boolean = false;
}
