import { db } from '@/db';
import { memberPlans } from '@/db/schemas/member-plans';
import { eq } from 'drizzle-orm';

async function updateStripePriceIds() {
  try {
    console.log('Stripe Price IDを更新します...\n');

    // 個人会員プラン
    const individualResult = await db
      .update(memberPlans)
      .set({
        stripePriceId: 'price_1SsFKvFyvqHGbm7Rl0qwmXjx',
        stripeOneTimePriceId: 'price_1SsMW0FyvqHGbm7RavWqX97G',
      })
      .where(eq(memberPlans.planCode, 'individual'))
      .returning();

    console.log('✓ 個人会員プラン:', individualResult[0]?.planName);
    console.log('  サブスク用: price_1SsFKvFyvqHGbm7Rl0qwmXjx');
    console.log('  単発用: price_1SsMW0FyvqHGbm7RavWqX97G');

    // 法人会員プラン
    const businessResult = await db
      .update(memberPlans)
      .set({
        stripePriceId: 'price_1SsFK6FyvqHGbm7R0hfpXw3F',
        stripeOneTimePriceId: 'price_1SsMX7FyvqHGbm7RWa6JRq07',
      })
      .where(eq(memberPlans.planCode, 'business'))
      .returning();

    console.log('✓ 法人会員プラン:', businessResult[0]?.planName);
    console.log('  サブスク用: price_1SsFK6FyvqHGbm7R0hfpXw3F');
    console.log('  単発用: price_1SsMX7FyvqHGbm7RWa6JRq07');

    // プラチナ個人会員プラン
    const platinumIndividualResult = await db
      .update(memberPlans)
      .set({
        stripePriceId: 'price_1SsFJJFyvqHGbm7RK8cojwOf',
        stripeOneTimePriceId: 'price_1SsMXbFyvqHGbm7RFDB74G8I',
      })
      .where(eq(memberPlans.planCode, 'platinum_individual'))
      .returning();

    console.log('✓ プラチナ個人会員プラン:', platinumIndividualResult[0]?.planName);
    console.log('  サブスク用: price_1SsFJJFyvqHGbm7RK8cojwOf');
    console.log('  単発用: price_1SsMXbFyvqHGbm7RFDB74G8I');

    // プラチナ法人会員プラン
    const platinumBusinessResult = await db
      .update(memberPlans)
      .set({
        stripePriceId: 'price_1SsFFyFyvqHGbm7RRdUUU22H',
        stripeOneTimePriceId: 'price_1SsMYFFyvqHGbm7RemkJ61P6',
      })
      .where(eq(memberPlans.planCode, 'platinum_business'))
      .returning();

    console.log('✓ プラチナ法人会員プラン:', platinumBusinessResult[0]?.planName);
    console.log('  サブスク用: price_1SsFFyFyvqHGbm7RRdUUU22H');
    console.log('  単発用: price_1SsMYFFyvqHGbm7RemkJ61P6');

    console.log('\n✅ すべてのPrice IDを更新しました！');

    // 確認のため全プランを表示
    console.log('\n現在のプラン一覧:');
    const allPlans = await db.select().from(memberPlans);
    allPlans.forEach(plan => {
      console.log(`  ${plan.planName} (${plan.planCode}):`);
      console.log(`    サブスク用: ${plan.stripePriceId || '未設定'}`);
      console.log(`    単発用: ${plan.stripeOneTimePriceId || '未設定'}`);
    });

  } catch (error) {
    console.error('エラー:', error);
  } finally {
    process.exit(0);
  }
}

updateStripePriceIds();
