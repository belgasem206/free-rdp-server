import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مرحباً 👋</h1>
      <p className="text-gray-600">هذا نموذج مبسّط شبيه ManyChat.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link className="p-4 rounded border hover:bg-gray-50" href="/flows">
          <div className="font-semibold mb-1">التدفقات</div>
          <div className="text-sm text-gray-600">أنشئ ونسّق رسائل البوت بصرياً.</div>
        </Link>
        <Link className="p-4 rounded border hover:bg-gray-50" href="/chat">
          <div className="font-semibold mb-1">الدردشة</div>
          <div className="text-sm text-gray-600">تابع المحادثات والرسائل.</div>
        </Link>
        <Link className="p-4 rounded border hover:bg-gray-50" href="/api">
          <div className="font-semibold mb-1">الـ API</div>
          <div className="text-sm text-gray-600">نقاط نهاية لقراءة/كتابة البيانات.</div>
        </Link>
      </div>
    </div>
  );
}
