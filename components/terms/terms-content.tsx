"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IK ALUMNI CGT supporter&apos;s CLUB 規約</CardTitle>
        <CardDescription>
          IK ALUMNI CGT supporter&apos;s CLUB の会員規約です。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h2 className="font-bold text-lg mb-3">第１章 総則</h2>

              <h3 className="font-semibold text-base mb-2">第１条</h3>
              <div className="text-muted-foreground space-y-2">
                <p>（１）本後援会は、ICHIKASHI ALUMNI COLOR GUARD TEAM を支援する団体。</p>
                <p>（２）この団体の名称は IK ALUMNI CGT supporter&apos;s CLUB と称する。</p>
                <p>
                  （３）この団体を次の所在地に置く。
                  <br />
                  茨城県つくば市谷田部３０１８－９
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第２章 目的と事業</h2>

              <h3 className="font-semibold text-base mb-2">第２条</h3>
              <p className="text-muted-foreground">
                本後援会は、ICHIKASHI ALUMNI COLOR GUARD TEAM
                の活動を支援するとともに、会員との親睦を図り、地域の音楽文化の向上発展や青少年の健全育成に寄与することを目的とする。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第３条</h3>
              <p className="text-muted-foreground mb-2">
                本後援会は前条の目的を達成するために次の事業を行う。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）自主公演の支援</p>
                <p>（２）本後援会会報の発行</p>
                <p>（３）その他支援活動と認めた事業</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第３章 会員及び組織</h2>

              <h3 className="font-semibold text-base mb-2">第４条</h3>
              <div className="text-muted-foreground space-y-2">
                <p>
                  （１）この団体の構成は ICHIKASHI ALUMNI COLOR GUARD TEAM
                  に所属する人間及びその保護者並びに、支援者で構成される。
                </p>
                <p>（２）加入・脱退等については随時可能とする。</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第５条</h3>
              <p className="text-muted-foreground">
                本後援会の会員は、ICHIKASHI ALUMNI COLOR GUARD TEAM
                の活動に賛同する個人会員及び団体並びに企業を法人会員とし、その他本後援会への特別な支援をお願いするプラチナ会員をもって組織するものとする。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第６条</h3>
              <p className="text-muted-foreground">
                本後援会に入会するには、書面による届出並びに、オンライン等で申込む方法によって入会し、その年会費を納入するものとする。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第４章 会費及び会計</h2>

              <h3 className="font-semibold text-base mb-2">第７条</h3>
              <p className="text-muted-foreground mb-2">
                本後援会の会費は次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>個人会員　一口　３，０００円</p>
                <p>法人会員　一口　１０，０００円</p>
                <p>プラチナ会員　一口　３０，０００円</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第８条</h3>
              <p className="text-muted-foreground">
                本後援会の経費は、会費・寄付金及びその他の収入をもって充てる。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第９条</h3>
              <p className="text-muted-foreground">
                本後援会の会計年度は、毎年４月１日より翌年３月３１日とする。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第５章 役員</h2>

              <h3 className="font-semibold text-base mb-2">第１０条</h3>
              <p className="text-muted-foreground mb-2">
                本後援会は、次の通り役員を置く。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）会長　１名</p>
                <p>（２）副会長　２名</p>
                <p>（３）会計　２名</p>
                <p>（４）事務局長　１名</p>
                <p>（５）監査　１名</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１１条</h3>
              <p className="text-muted-foreground">
                前条における役員の選出は、役員会総会にて承認を得る。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１２条</h3>
              <p className="text-muted-foreground mb-2">
                役員の職務は、次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）会長は、本後援会を代表し、会務を統括する。</p>
                <p>
                  （２）副会長は、会長を補佐し、会長事故あるときは、その職務を代行する。
                </p>
                <p>（３）監査は、事業の運営及び会計を監査する。</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１３条</h3>
              <p className="text-muted-foreground mb-2">
                役員の任期は次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）役員の任期は、１年とし再任を妨げない。</p>
                <p>（２）補欠者又は、増員による役員の任期は、任期の残余期間とする。</p>
                <p>
                  （３）役員の任期満了時であっても、後任者の選出無きときは、後任者が選出されるまでその責務を遂行する。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１４条</h3>
              <p className="text-muted-foreground">
                本後援会は、顧問を置くことができるものとし、会長が委嘱し会長の諮問に応ずる。
              </p>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第６章 会議</h2>

              <h3 className="font-semibold text-base mb-2">第１５条</h3>
              <p className="text-muted-foreground">
                本後援会の会議は、総会及び役員会とする。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１６条</h3>
              <p className="text-muted-foreground">
                総会は、役員会を以て構成し毎年1回年度終了後2カ月以内に会長が招集し、開催する。総会の議長は、会長とする。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１７条</h3>
              <p className="text-muted-foreground">
                役員会は役員をもって構成し、随時会長が招集し、役員会の議長を兼ねる。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１８条</h3>
              <p className="text-muted-foreground mb-2">
                会議の定数及び議決の方法は、次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>
                  （１）議長及び役員会は、構成員の半数以上の出席をもって成立する。
                  <br />
                  　但し、委任状によって意思表意したるものは出席者とみなす。
                </p>
                <p>
                  （２）会議の議決は、出席者の過半数でこれを決し、可否同数時は議長が決する。
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第１９条</h3>
              <p className="text-muted-foreground mb-2">
                総会の付議すべき事項は、次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）事業報告及び計画</p>
                <p>（２）決算</p>
                <p>（３）役員の選任</p>
                <p>（４）規約の変更</p>
                <p>（５）その他特に必要な事項</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第２０条</h3>
              <p className="text-muted-foreground mb-2">
                役員会に付議すべき事項は、次の通りとする。
              </p>
              <div className="text-muted-foreground space-y-1 ml-4">
                <p>（１）事業及び計画に関すること</p>
                <p>（２）会計運用に関すること</p>
                <p>（３）役員及び顧問の推薦に関すること</p>
                <p>（４）規約の詳細に関すること</p>
                <p>（５）その他特に必要なこと</p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-lg mb-3 mt-6">第７章 附則</h2>

              <h3 className="font-semibold text-base mb-2">第２１条</h3>
              <p className="text-muted-foreground">
                本後援会は、会員の個人情報を適切に管理し、本後援会運営に必要な範囲でのみ利用する。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第２２条</h3>
              <p className="text-muted-foreground">
                本規約の施行に必要な細則は、別に定め役員会の承認を得るものとする。
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 mt-4">第２３条</h3>
              <p className="text-muted-foreground">
                本規約の変更は、総会の過半数の賛同を必要とする。
              </p>
            </section>

            <section className="mt-6 pt-4 border-t">
              <p className="text-muted-foreground mb-4">
                設立年月日：２０２５年７月１日
              </p>
              <p className="text-muted-foreground mb-4">
                この規約の記載内容について、事実と相違ないことを証明します。
              </p>
              <div className="text-muted-foreground">
                <p>IK ALUMNI CGT supporter&apos;s CLUB</p>
                <p>会長　細 沼 桂 一</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild className="min-h-11">
          <Link href="/">Homeに戻る</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
