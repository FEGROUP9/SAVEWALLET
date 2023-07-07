# 초기설정 공지

### index.html

RESET CSS 적용되어 있습니다.

### tsconfig.json

수정하실/추가하실 부분 생기시면 tsconfig에서 경로별칭 수정/추가하시면 됩니다!

    "paths": {

    	"@/*": ["src/*"],
    	"pages/*": ["src/pages/*"],
    	"components/*": ["src/components/*"],

    	"calender/*": ["src/components/calender/*"],
    	"chart/*": ["src/components/chart/*"],
    	"home/*": ["src/components/home/*"],
    	"list/*": ["src/components/list/*"],

    	"recoil/*": ["src/recoil/*"],
    	"types/*": ["src/types/*"],
    	"utils/*": ["src/utils/*"],
    	"api/*": ["src/api/*"]
    }

## index.ts

### 1. named export

- react snippet 사용시 rafc 사용 후 최상단 import react from 'React' 제거해주신 후 컴포넌트 작업하시면 됩니다!

### 2. index.ts 파일 내에 export 경로 작성

- export \* from 'components(경로별칭 적용)/App(index.ts와 동일 폴더에 위치한 파일명, tsx생략)'
- export \* from 'components(경로별칭 적용)/common(하위 폴더 입력시, 하위 폴더의 index.ts를 다시 탐색합니다.)'
- 따라서 components/index만으로 하위 폴더의 index는 추가적으로 명시할 필요가 없게 됩니다.
- e.g) `import { App, NotFound, ErrorComponent } from  'components/index'`
- App은 components내에, NotFound, ErrorComponents는 components/common내에 위치해있습니다.
- componets내의 index.ts에 `export  *  from  'components/common'` 를 입력해줌으로 예시의 구조로 import가 가능해집니다.
