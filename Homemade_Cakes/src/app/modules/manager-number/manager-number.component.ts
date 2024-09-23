import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
// import { getTradeData } from './data';
// import { SBDescriptionComponent } from '../common/dp.component';
// import { SBActionDescriptionComponent } from '../common/adp.component';

@Component({
  selector: 'app-manager-number',
  templateUrl: './manager-number.component.html',
  styleUrls: ['./manager-number.component.css'],

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

  constructor(private serviceNum: ManagerNumberService) {
  }

  ngOnInit(): void {
    this.data = this.serviceNum.data
    this.pageSettings = { pageCount: 3 };
    // this.data = new DataManager({ url: 'https://services.syncfusion.com/angular/production/api/orders', adaptor: new UrlAdaptor });
    this.loadingIndicator = { indicatorType: 'Spinner' };
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

  updateClick(e) {}

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
}
