# Expo/React Native モバイル版 - 要件定義書

## 1. 概要

### 1.1 責務範囲
Expo エージェントは数独アプリケーションのモバイル版（iOS/Android）の実装を担当します。ネイティブアプリの利点を活かしたタッチインターフェースと、オフライン完結のゲーム体験を提供します。

### 1.2 技術スタック
- **フレームワーク**: Expo SDK 50+ (React Native 0.73+)
- **ルーティング**: Expo Router (file-based routing)
- **UI コンポーネント**: React Native Elements + Native Base
- **状態管理**: React Context API + useReducer
- **データ保存**: AsyncStorage + SQLite (Expo SQLite)
- **テスト**: Jest + React Native Testing Library
- **デバイス機能**: 最小限（バイブレーション、画面向き）

### 1.3 対応プラットフォーム
- **iOS**: iOS 13.0以上
- **Android**: API Level 26 (Android 8.0)以上
- **画面サイズ**: 4.7インチ〜12.9インチ
- **デバイス向き**: Portrait & Landscape対応

### 1.4 開発期間
- **Phase 1 (Day 1-3)**: Web版ロジック移植・基本UI
- **Phase 2 (Day 4-5)**: モバイル最適化・ネイティブ機能
- **Phase 3 (Day 6-7)**: UX改善・最終調整

## 2. 機能要件

### 2.1 MVP機能（Phase 1優先）

#### 2.1.1 数独グリッド表示（モバイル最適化）
```typescript
interface MobileSudokuGrid {
  touchInteraction: {
    tapToSelect: boolean;      // タップでセル選択
    longPressActions: boolean; // 長押しでメモモード
    swipeNavigation: boolean;  // スワイプでセル移動
  };
  responsiveSize: {
    phone: { cellSize: 35, fontSize: 18 };     // 5.5インチ以下
    phablet: { cellSize: 40, fontSize: 20 };   // 6.0-6.7インチ
    tablet: { cellSize: 55, fontSize: 24 };    // 7インチ以上
  };
}
```

**モバイル固有の実装**:
- **タッチファーストUI**: 指での操作に最適化したサイズとレスポンス
- **Safe Area対応**: ノッチ・ホームインジケーター考慮
- **スクロール対応**: 小さな画面でのグリッド表示最適化
- **フィードバック**: タップ時のハプティックフィードバック

#### 2.1.2 モバイル向け入力システム
- **数字キーパッド**: 画面下部固定の大きなボタン
- **ジェスチャー操作**: 
  - タップ: セル選択
  - 長押し: メモモード切り替え
  - ダブルタップ: セル内容削除
  - スワイプ: セル間移動（上下左右）
- **キーパッドレイアウト**: 
  - 横向き: 1行に1-9を配置
  - 縦向き: 3×3グリッドレイアウト

#### 2.1.3 画面遷移とナビゲーション
```
Navigation Structure:
├── (tabs)/
│   ├── game/            # メインゲーム画面
│   ├── new-game/        # 新規ゲーム・難易度選択
│   ├── statistics/      # 統計・履歴
│   └── settings/        # 設定画面
└── modal/
    ├── hint/            # ヒントモーダル
    ├── completion/      # 完成通知
    └── help/            # ヘルプ・チュートリアル
```

### 2.2 重要機能（Phase 2）

#### 2.2.1 ヒント機能（モバイル最適化）
```typescript
interface MobileHintSystem {
  presentation: {
    modalDialog: boolean;        // モーダルでのヒント表示
    toastNotification: boolean;  // 軽微なヒントはトースト
    visualHighlight: boolean;    // 該当セルの視覚的強調
    animatedHint: boolean;       // アニメーション付きヒント
  };
  accessibility: {
    voiceOver: boolean;          // スクリーンリーダー対応
    hapticFeedback: boolean;     // 触覚フィードバック
    colorBlindSupport: boolean;  // 色覚サポート
  };
}
```

**モバイル特化機能**:
- **ハプティックフィードバック**: ヒント発見時の振動通知
- **アニメーション**: ヒント提示の滑らかなアニメーション
- **音声読み上げ**: VoiceOver/TalkBack対応のヒント読み上げ

#### 2.2.2 データ保存システム（モバイル）
- **AsyncStorage**: 設定・統計の軽量データ保存
- **SQLite**: ゲーム履歴・複数保存データの永続化
- **バックアップ機能**: iCloud/Google Drive連携（将来拡張）
- **データ移行**: アプリ更新時のデータ保持

#### 2.2.3 プッシュ通知（オプション）
```typescript
interface NotificationSystem {
  dailyReminder: boolean;     // 日次プレイリマインダー
  gameCompletion: boolean;    // ゲーム完成通知
  hintAvailable: boolean;     // 新しいヒント利用可能
  weeklyStats: boolean;       // 週次統計サマリー
}
```

### 2.3 モバイル特化機能（Phase 3）

#### 2.3.1 デバイス機能活用
- **画面向き対応**: Portrait/Landscape両対応
- **ダークモード**: システム設定連動のダークテーマ
- **バイブレーション**: エラー時・完成時の触覚フィードバック
- **バックグラウンド保存**: アプリ切り替え時の自動保存

#### 2.3.2 アクセシビリティ強化
- **VoiceOver/TalkBack**: 完全なスクリーンリーダー対応
- **動的文字サイズ**: システム設定に応じたフォントサイズ調整
- **高コントラスト**: 視覚障害者向けの高コントラストモード
- **音声ガイド**: 操作時の音声フィードバック

## 3. UI/UX設計（モバイル特化）

### 3.1 デバイス別レイアウト

#### スマートフォン（Portrait）
```javascript
const PhonePortraitLayout = {
  screenDimensions: { width: 375, height: 812 },
  sudokuGrid: {
    size: 315, // 35px × 9
    margin: 30,
    position: 'center-top'
  },
  numberPad: {
    layout: 'grid-3x3',
    size: { width: 315, height: 210 },
    position: 'bottom-fixed'
  },
  controls: {
    layout: 'horizontal-row',
    position: 'between-grid-and-pad'
  }
};
```

#### スマートフォン（Landscape）
```javascript
const PhoneLandscapeLayout = {
  screenDimensions: { width: 812, height: 375 },
  sudokuGrid: {
    size: 280, // 31px × 9
    margin: 20,
    position: 'center-left'
  },
  numberPad: {
    layout: 'vertical-strip',
    size: { width: 200, height: 280 },
    position: 'center-right'
  }
};
```

#### タブレット
```javascript
const TabletLayout = {
  sudokuGrid: {
    size: 495, // 55px × 9
    margin: 40
  },
  numberPad: {
    layout: 'horizontal-row',
    buttonSize: 60,
    spacing: 10
  },
  sidePanels: {
    hints: { width: 200, position: 'left' },
    statistics: { width: 200, position: 'right' }
  }
};
```

### 3.2 タッチインターフェース設計

#### タッチターゲットサイズ
```css
/* Apple Human Interface Guidelines準拠 */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  margin: 2px; /* 隣接要素との間隔 */
}

/* Android Material Design準拠 */
.material-touch {
  min-width: 48px;
  min-height: 48px;
  margin: 4px;
}
```

#### ジェスチャー仕様
```typescript
interface GestureHandling {
  tap: {
    singleTap: 'selectCell',
    doubleTap: 'clearCell',
    delay: 200 // ms
  };
  longPress: {
    duration: 500, // ms
    action: 'toggleNoteMode',
    feedback: 'haptic'
  };
  swipe: {
    sensitivity: 50, // px
    directions: ['up', 'down', 'left', 'right'],
    action: 'moveSelection'
  };
  pinch: {
    disabled: true // 数独ではズーム不要
  };
}
```

### 3.3 カラーシステム（モバイル対応）

#### ライトテーマ（モバイル最適化）
```javascript
const MobileLightTheme = {
  colors: {
    primary: '#007AFF',      // iOS Blue
    secondary: '#34C759',    // iOS Green
    background: '#FFFFFF',
    surface: '#F2F2F7',     // iOS Grouped Background
    border: '#C6C6C8',      // iOS Separator
    text: '#000000',
    textSecondary: '#8E8E93',
    error: '#FF3B30',       // iOS Red
    warning: '#FF9500',     // iOS Orange
    success: '#34C759'      // iOS Green
  }
};
```

#### ダークテーマ（システム連動）
```javascript
const MobileDarkTheme = {
  colors: {
    primary: '#0A84FF',      // iOS Dark Blue
    secondary: '#32D74B',    // iOS Dark Green
    background: '#000000',
    surface: '#1C1C1E',     // iOS Dark Grouped Background
    border: '#38383A',      // iOS Dark Separator
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    error: '#FF453A',       // iOS Dark Red
    warning: '#FF9F0A',     // iOS Dark Orange
    success: '#32D74B'      // iOS Dark Green
  }
};
```

## 4. コンポーネント設計

### 4.1 モバイル特化コンポーネント

```typescript
// タッチ最適化されたSudokuGrid
interface MobileSudokuGridProps {
  puzzle: number[][];
  onCellPress: (row: number, col: number) => void;
  onCellLongPress: (row: number, col: number) => void;
  selectedCell: {row: number, col: number} | null;
  hapticEnabled: boolean;
  accessibilityEnabled: boolean;
}

// モバイル向け数字パッド
interface MobileNumberPadProps {
  layout: 'grid' | 'row' | 'vertical';
  onNumberPress: (number: number) => void;
  onDeletePress: () => void;
  onModeToggle: () => void;
  currentMode: 'number' | 'note';
  orientation: 'portrait' | 'landscape';
}

// タッチフレンドリーなボタン
interface MobileButtonProps {
  title: string;
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  accessibilityLabel: string;
}
```

### 4.2 レスポンシブコンポーネント
```typescript
// デバイス情報を提供するHook
const useDeviceInfo = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLandscape = width > height;
  const screenSize = getScreenSize(width);
  
  return { width, height, isTablet, isLandscape, screenSize };
};

// Safe Area対応コンテナ
const SafeAreaContainer = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      {children}
    </View>
  );
};
```

## 5. データ管理（モバイル）

### 5.1 AsyncStorage設計
```typescript
interface AsyncStorageKeys {
  SETTINGS: 'sudoku_settings';
  CURRENT_GAME: 'sudoku_current_game';
  STATISTICS: 'sudoku_statistics';
  THEME_PREFERENCE: 'sudoku_theme';
  FIRST_LAUNCH: 'sudoku_first_launch';
}

// 設定データの構造
interface MobileSettings extends BaseSettings {
  hapticEnabled: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  keepScreenOn: boolean;
  dailyReminder: boolean;
  notificationTime: string; // HH:MM format
}
```

### 5.2 SQLite設計（ゲーム履歴）
```sql
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  difficulty TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  completion_time INTEGER, -- seconds
  hints_used INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT 0,
  puzzle TEXT NOT NULL,       -- JSON serialized
  solution TEXT NOT NULL,     -- JSON serialized
  user_inputs TEXT,           -- JSON serialized
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE statistics (
  id INTEGER PRIMARY KEY,
  total_games INTEGER DEFAULT 0,
  completed_games INTEGER DEFAULT 0,
  total_play_time INTEGER DEFAULT 0,
  best_time_easy INTEGER,
  best_time_normal INTEGER,
  best_time_hard INTEGER,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_hints_used INTEGER DEFAULT 0,
  updated_at INTEGER DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 データ同期戦略
```typescript
interface DataSyncManager {
  // ローカルデータの定期バックアップ
  backupToCloud: () => Promise<void>;
  
  // アプリ復元時のデータ復旧
  restoreFromCloud: () => Promise<void>;
  
  // データ整合性チェック
  validateData: () => Promise<boolean>;
  
  // 古いデータの清理
  cleanupOldData: (daysToKeep: number) => Promise<void>;
}
```

## 6. パフォーマンス最適化

### 6.1 レンダリング最適化
```typescript
// メモ化されたSudokuCell
const MemoizedSudokuCell = React.memo(SudokuCell, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.hasError === nextProps.hasError &&
    prevProps.isInitial === nextProps.isInitial
  );
});

// グリッド全体の最適化
const OptimizedSudokuGrid = () => {
  const { gridData } = useSudokuGame();
  
  // 大きな状態変更時のみ再レンダリング
  const memoizedGrid = useMemo(() => {
    return gridData.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        key: `${rowIndex}-${colIndex}`
      }))
    );
  }, [gridData]);
  
  return (
    <FlatList
      data={memoizedGrid}
      numColumns={9}
      keyExtractor={(item) => item.key}
      renderItem={renderCell}
      removeClippedSubviews={true}
    />
  );
};
```

### 6.2 メモリ管理
```typescript
// 画像・アセットの効率的管理
const AssetManager = {
  preloadImages: async () => {
    const images = ['background', 'icons', 'animations'];
    await Promise.all(
      images.map(name => 
        Asset.fromModule(require(`../assets/images/${name}`)).downloadAsync()
      )
    );
  },
  
  clearCache: () => {
    // 不要なキャッシュクリア
    Image.getSize.cache.clear?.();
  }
};

// バックグラウンド時の処理最適化
const useBackgroundOptimization = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        // バックグラウンド移行時の処理
        gameActions.pauseGame();
        gameActions.saveCurrentState();
      } else if (nextAppState === 'active') {
        // フォアグラウンド復帰時の処理
        gameActions.resumeGame();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);
};
```

## 7. プラットフォーム固有実装

### 7.1 iOS固有機能
```typescript
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const iOSFeatures = {
  // ハプティックフィードバック
  hapticFeedback: {
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  },
  
  // VoiceOver対応
  accessibility: {
    announce: (message: string) => {
      if (Platform.OS === 'ios') {
        AccessibilityInfo.announceForAccessibility(message);
      }
    }
  }
};
```

### 7.2 Android固有機能
```typescript
import { BackHandler } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const AndroidFeatures = {
  // バックボタン処理
  setupBackHandler: () => {
    const backAction = () => {
      // ゲーム中の場合は確認ダイアログ
      if (gameState.inProgress) {
        showExitConfirmation();
        return true; // デフォルトの戻る動作を防止
      }
      return false; // デフォルトの戻る動作
    };
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  },
  
  // ナビゲーションバー色設定
  setupNavigationBar: () => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#FFFFFF');
    }
  }
};
```

## 8. テスト要件（モバイル特化）

### 8.1 単体テスト
```typescript
describe('MobileSudokuGrid', () => {
  test('タップでセルが選択される', () => {
    const mockOnCellPress = jest.fn();
    render(<MobileSudokuGrid onCellPress={mockOnCellPress} />);
    
    fireEvent.press(screen.getByTestId('cell-0-0'));
    expect(mockOnCellPress).toHaveBeenCalledWith(0, 0);
  });
  
  test('長押しでメモモードが切り替わる', async () => {
    const mockOnLongPress = jest.fn();
    render(<MobileSudokuGrid onCellLongPress={mockOnLongPress} />);
    
    fireEvent(screen.getByTestId('cell-0-0'), 'longPress');
    expect(mockOnLongPress).toHaveBeenCalledWith(0, 0);
  });
});

describe('MobileNumberPad', () => {
  test('横向きで1行レイアウトが適用される', () => {
    render(<MobileNumberPad orientation="landscape" layout="row" />);
    
    const numberPad = screen.getByTestId('number-pad');
    expect(numberPad).toHaveStyle({ flexDirection: 'row' });
  });
});
```

### 8.2 統合テスト
```typescript
describe('モバイルゲームフロー', () => {
  test('ゲーム開始から完成まで（タッチ操作）', async () => {
    render(<SudokuApp />);
    
    // 難易度選択
    fireEvent.press(screen.getByText('易しい'));
    
    // セルタップ・数字入力
    fireEvent.press(screen.getByTestId('cell-0-0'));
    fireEvent.press(screen.getByText('1'));
    
    // 自動保存確認
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('sudoku_current_game');
    });
  });
});
```

### 8.3 デバイステスト
- **物理デバイス**: iPhone (12 mini, 13, 14), Android (Pixel, Samsung)
- **画面サイズ**: 4.7" - 12.9" の範囲
- **OS バージョン**: iOS 13+ / Android 8+
- **アクセシビリティ**: VoiceOver/TalkBack有効時のテスト

## 9. 他エージェントとの連携

### 9.1 Next.jsエージェントとの共通化
```typescript
// 共通ロジックの抽象化
interface SudokuLogicAdapter {
  generatePuzzle: (difficulty: Difficulty) => PuzzleData;
  validateMove: (puzzle: number[][], row: number, col: number, value: number) => boolean;
  checkCompletion: (puzzle: number[][]) => boolean;
  getHint: (puzzle: number[][]) => HintData;
}

// プラットフォーム固有の実装
class MobileSudokuAdapter implements SudokuLogicAdapter {
  // Web版のロジックを継承・拡張
}
```

### 9.2 UIUXエージェントからの設計受領
- **デザインシステム**: カラー・フォント・間隔の定義
- **モバイル固有ガイドライン**: タッチターゲット・ジェスチャー仕様
- **アクセシビリティ**: コントラスト・読み上げテキスト要件

### 9.3 QAエージェントへの提供
- **デバイステスト要件**: 対応機種・OS バージョンリスト
- **パフォーマンス指標**: 起動時間・メモリ使用量目標
- **アクセシビリティテスト**: VoiceOver/TalkBack テストケース

## 10. 実装優先順位

### Phase 1（Day 1-3）- 基本移植
1. **Expoプロジェクト作成** (0.5日)
   - SDK 50+での新規プロジェクト
   - 基本依存関係とナビゲーション設定
   - TypeScript + React Native Elements

2. **Web版コード移植** (1.5日)
   - 数独ロジックの共通化
   - React Native コンポーネントへの変換
   - 基本レイアウトとスタイリング

3. **タッチインターフェース実装** (1日)
   - タップ・長押し・スワイプ処理
   - モバイル向け数字パッド
   - Safe Area対応

### Phase 2（Day 4-5）- モバイル最適化  
1. **ヒント機能移植** (0.5日)
   - モーダル形式でのヒント表示
   - ハプティックフィードバック統合
   - アクセシビリティ対応

2. **データ永続化** (0.5日)
   - AsyncStorage実装
   - SQLite統合とマイグレーション
   - ゲーム保存・復元機能

3. **デバイス機能統合** (1日)
   - プラットフォーム固有機能の実装
   - バックグラウンド処理最適化
   - 通知システム（基本）

### Phase 3（Day 6-7）- 最終調整
1. **UX改善** (0.5日)
   - アニメーション・トランジション
   - 操作フィードバックの改善
   - レスポンシブ調整

2. **テスト・最適化** (1日)
   - デバイステスト・パフォーマンス検証
   - アクセシビリティ最終確認
   - メモリリーク・クラッシュ対策

3. **ビルド・配布準備** (0.5日)
   - プロダクションビルド最適化
   - アプリアイコン・スプラッシュスクリーン
   - ストア配布用メタデータ準備

## 11. 成果物

### 11.1 アプリケーション
- **APKファイル**: Android配布用
- **IPA ファイル**: iOS配布用（TestFlight）
- **Expo Go**: 開発・テスト用バージョン
- **ソースコード**: TypeScript/React Native実装

### 11.2 技術文書
- **API仕様書**: ネイティブ機能統合仕様
- **デプロイメントガイド**: ストア配布手順
- **パフォーマンスレポート**: 最適化結果レポート
- **アクセシビリティレポート**: 対応機能一覧

### 11.3 テスト成果物
- **デバイステスト結果**: 対応機種での動作確認
- **パフォーマンステスト**: 起動時間・メモリ使用量測定
- **アクセシビリティテスト**: VoiceOver/TalkBack動作確認

---

**文書情報**
- 作成日: 2025-08-22  
- 担当エージェント: Expo モバイル開発エージェント
- 依存関係: Next.js→Expo, UIUX→Expo, Expo→QA
- 優先度: 高（Web版後の重要機能）